function checkUrl(inputUrl) {
    console.log("::: Running checkUrl :::", inputUrl);
    const regex = inputUrl.match(/^(https?:\/\/)?(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|localhost)(:\d+)?(\/[^\s]*)?$/);
    if (regex == null) {
        return false
    } else {
        return true
    }
}

export { checkUrl };
