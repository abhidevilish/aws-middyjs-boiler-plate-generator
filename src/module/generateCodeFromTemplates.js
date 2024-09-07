const { renderFile } = require("ejs");
const { writeFile } = require("fs/promises");
const { join } = require("path");
const {
	createSSMString,
	createSqsString,
	createS3String,
} = require("./stringBuilder");

module.exports = {
	generateCodeFromTemplates: async (path, envKeys) => {
		//fetch ssm env variables
		let ssmkeys = envKeys.filter((e) => e.startsWith("SSM_"));

		//handle sqs calls if sqs flag is set
		let sqsString = '';
		let s3String = '';
		if (process.env["SEND_SQS_MESSAGE"]) {
			let sqsKeys = envKeys.filter((e) => e.startsWith("SQS_"));
			sqsString = createSqsString(sqsKeys);
		}

		if (process.env["SAVE_TO_S3"]) {
			let s3BucketKeys = envKeys.filter((e) => e.startsWith("S3_BUCKET"));
			let s3KeyKeys = envKeys.filter((e) => e.startsWith("S3_KEY"));
			s3String = createS3String(s3BucketKeys, s3KeyKeys);

		}

		let awsFunctionalityData = {
			ssmString: ssmkeys.length ? createSSMString(ssmkeys) : "",
			sqsString,
			s3String
		};

		let dateFormats3PathString =
			"const dateFormatS3Path = () =>" +
			"`${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2,'0')}/${String(new Date().getDate()).padStart(2, '0')}`" +
			"\nexport default dateFormatS3Path";

		//process templates

		const loggerTemplate = await renderFile(
			join(__dirname, "../templates/logger.ejs"),
		);
		const prettierTemplate = await renderFile(
			join(__dirname, "../templates/prettier.ejs"),
		);
		const testTemplate = await renderFile(
			join(__dirname, "../templates/app.spec.ejs"),
			awsFunctionalityData,
		);
		const appTemplate =
			process.env.INPUT_PARSER == "SQS"
				? await renderFile(
					join(__dirname, "../templates/app/app.sqs.ejs"),
					awsFunctionalityData,
				)
				: await renderFile(
					join(__dirname, "../templates/app/app.sns-sqs.ejs"),
					awsFunctionalityData,
				);
		const sqsTemplate = await renderFile(
			join(__dirname, "../templates/sqsSendMessage.ejs"),
			awsFunctionalityData,
		);
		const s3Template = await renderFile(
			join(__dirname, "../templates/s3.ejs"),
			awsFunctionalityData,
		);
		//convert processed templates to respectiv scripts
		await writeFile(join(path, "src", "logger.mjs"), loggerTemplate);
		await writeFile(join(path, "prettier.json"), prettierTemplate);
		await writeFile(join(path, "src", "tests", "app.spec.mjs"), testTemplate);
		await writeFile(join(path, "src", "app.mjs"), appTemplate);
		await writeFile(join(path, ".gitignore"), "node_modules");
		await writeFile(
			join(path, "src", "utils", "dateFormats3Path.mjs"),
			dateFormats3PathString,
		);
		await writeFile(
			join(path, "src", "utils", "sendMessageMiddleware.mjs"),
			sqsTemplate,
		);
		await writeFile(
			join(path, "src", "utils", "s3.mjs"),
			s3Template,
		);
	},
};
