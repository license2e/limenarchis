module.exports = (evt, id, dataType, dataResp) => {
  let data = dataResp;
  if (dataType === 'error') {
    data = `${dataResp}`;
  }
  return evt.sender.send(`receiveMessage-${id}`, dataType, data);
};
