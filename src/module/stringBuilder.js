let mergeBucketKey = (s3BucketKeys, s3KeyKeys) => {
  return s3BucketKeys.map((e) => {
    // Extract the last character of the current element in array 'a'
    const lastCharBucket = e.charAt(e.length - 1);

    // Find the corresponding element in array 'b' with the same last character
    const correspondingKeys = s3KeyKeys.find(
      (f) => f.charAt(f.length - 1) === lastCharBucket
    );

    // Return an array containing both elements
    return [e, correspondingKeys];
  });

}

module.exports = {
  createSSMString: (ssmKeys) => {
    let str = `.use(
                ssm({
                fetchData: {
                `;
    ssmKeys.map((e) => (str += `${e}: ${process.env[e]} , \n`));
    str += `},
                setToContext: true
                })
            )  `;
    return str;
  },
  createSqsString: (sqsKeys) => {
    let str = "queueParams :[\n";
    sqsKeys.map(e => str += `{url : ${process.env[e]},\n sqsMessage :'add-your-message'},\n`
    );
    return (str += "]");
  },
  createS3String: (s3BucketKeys, s3KeyKeys) => {
    let s3Keys = mergeBucketKey(s3BucketKeys, s3KeyKeys)

    let str = `s3WriteRequest :[\n`;
    s3Keys.map(e =>
      str += `{Bucket : ${process.env[e[0]]}, Key : ${process.env[e[1]]}, Body : 'add-your-message'},\n`
    )
    return (str += "]");
  }
};

