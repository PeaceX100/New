const pb = {
  le: '<:le:1157337831635701801>',
  me: '<:me:1157338685629534322>',
  re: '<:re:1157338822204461117>',
  lf: '<:lf:1157338974134747218>',
  mf: '<:mf:1157339124605386844>',
  rf: '<:rf:1157339200916557894>',
};
 
function formatResults(upvotes = [], downvotes = []) {
  const totalVotes = upvotes.length + downvotes.length;
  const progressBarLength = 14;
  const filledSquares = Math.round((upvotes.length / totalVotes) * progressBarLength) || 0;
  const emptySquares = progressBarLength - filledSquares || 0;
 
  if (!filledSquares && !emptySquares) {
    emptySquares = progressBarLength;
  }
 
  const upPercentage = (upvotes.length / totalVotes) * 100 || 0;
  const downPercentage = (downvotes.length / totalVotes) * 100 || 0;
 
  const progressBar =
    (filledSquares ? pb.lf : pb.le) +
    (pb.mf.repeat(filledSquares) + pb.me.repeat(emptySquares)) +
    (filledSquares === progressBarLength ? pb.rf : pb.re);
 
  const results = [];
  results.push(
    `👍 ${upvotes.length} upvotes (${upPercentage.toFixed(1)}%) • 👎 ${
      downvotes.length
    } downvotes (${downPercentage.toFixed(1)}%)`
  );
  results.push(progressBar);
 
  return results.join('\n');
}
 
module.exports = formatResults;