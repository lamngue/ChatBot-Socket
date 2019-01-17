const getTime = () => {
    const date = new Date();
    const dateString = `It's currently ${date.getHours().toString()} : ${date.getMinutes().toString()}`;
    return dateString;
};
module.exports = {getTime};