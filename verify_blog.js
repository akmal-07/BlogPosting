
async function testBlogAPI() {
    const baseUrl = 'http://localhost:3000';

    // 1. Create a Post
    console.log('Testing Create Post...');
    const postData = {
        title: 'Test Post ' + Date.now(),
        content: 'This is a content for the test post.',
        author: 'testuser'
    };

    try {
        const createRes = await fetch(`${baseUrl}/createPost`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        });
        const createdPost = await createRes.json();
        console.log('Create Status:', createRes.status);
        console.log('Created Post ID:', createdPost._id);

        if (createRes.ok) {
            // 2. Get All Posts
            console.log('\nTesting Get All Posts...');
            const getRes = await fetch(`${baseUrl}/posts`);
            const posts = await getRes.json();
            console.log('Get Status:', getRes.status);
            console.log('Number of posts:', posts.length);
            console.log('Latest Post Title:', posts[0].title);

            // 3. Get Single Post
            if (createdPost._id) {
                console.log('\nTesting Get Single Post...');
                const singleRes = await fetch(`${baseUrl}/post/${createdPost._id}`);
                const singlePost = await singleRes.json();
                console.log('Get Single Status:', singleRes.status);
                console.log('Retrieved Post Content:', singlePost.content);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

testBlogAPI();
