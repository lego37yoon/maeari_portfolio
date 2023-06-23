/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
    const postData = await fetch("/api/social?type=tistory");
    const postJson = await postData.json();
    const postArray = [];
    
    if (postJson.tistory.status !== "200") {
        return {
            status: postJson.tistory.status,
            error: postJson.tistory.error_message
        }
    } else {
        let postCount = 0
        postJson.tistory.item.posts.forEach(post => {
            if (post.visibility === "20" && 
                post.categoryId !== "0" &&
                postCount < 5) {
                postArray.push(post);
                postCount++;
            }
        });

        return {
            url: 
                (postJson.tistory.item.secondaryUrl === "" ? 
                    postJson.tistory.item.url : postJson.tistory.item.secondaryUrl),
            posts: postArray
        }
    }
}