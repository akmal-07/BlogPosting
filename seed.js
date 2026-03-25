const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Post = require('./models/Post');

const DB_URI = "mongodb://127.0.0.1:27017/blogDB";

const USERS = ["Gohit", "Harsha", "Sashank", "Prasad", "Pavan"];

const TAGS = [
    "Cricket", "Movies", "F1", "Robotics", "Studies",
    "Technology", "Music", "Travel", "Food", "Fitness",
    "Gaming", "Science", "Art", "Fashion", "Photography",
    "Nature", "Books", "Sports", "Business", "Health"
];

// Map tags to better search queries to avoid issues like "cricket" showing the insect
const IMAGE_KEYWORD_MAP = {
    "Cricket": "cricket,match,sport",
    "F1": "formula1,racing",
    "Movies": "cinema,movie,theater",
    "Robotics": "robot,tech,robotics",
    "Studies": "studying,university,education",
    "Technology": "technology,computer",
    "Music": "concert,guitar,music",
    "Travel": "travel,destination",
    "Food": "delicious,food,restaurant",
    "Fitness": "gym,workout,fitness",
    "Gaming": "esports,videogame,gaming",
    "Science": "laboratory,science",
    "Art": "painting,artwork,art",
    "Fashion": "fashion,runway,style",
    "Photography": "camera,photographer",
    "Nature": "landscape,nature",
    "Books": "library,books",
    "Sports": "athletics,sports",
    "Business": "corporate,office,business",
    "Health": "wellness,health"
};

const NEWS_TEMPLATES = {
    "Cricket": [
        "Breaking News: India clinches an unbelievable victory in the final over of the T20 series! The spinners completely dictated the middle overs.",
        "Recent updates from the ICC indicate a major shift in the Test Championship points system ahead of the next cycle.",
        "Injury concerns pile up for the national squad as the star fast bowler is ruled out of the upcoming bilateral series.",
        "In latest cricket news, franchise leagues continue to dominate the calendar, raising questions about player workload management."
    ],
    "F1": [
        "Formula 1 Update: Red Bull brings a massive aero upgrade to the European leg, looking to secure their constructor's lead.",
        "Ferrari strategists face heat after another questionable pitstop call cost them a guaranteed podium finish.",
        "Driver market rumor: A major seat shake-up is expected for next season as multiple contracts expire at the end of the year.",
        "Latest tech analysis reveals how McLaren has managed to unlock serious straight-line speed with their new DRS wing."
    ],
    "Movies": [
        "Box Office Report: The highly anticipated sci-fi epic shattered opening weekend records globally.",
        "Oscar Buzz: Several indie films from recent festivals have emerged as strong contenders for Best Picture.",
        "Casting News: The lead role for the upcoming superhero reboot has finally been confirmed after months of speculation.",
        "Industry insights reveal streaming giants are cutting back on bloated budgets, focusing instead on high-quality scriptwriting."
    ],
    "Technology": [
        "Tech News: A major breakthrough in AI models allows them to run natively on smartphones without internet connectivity.",
        "The latest semiconductor report suggests that the global chip shortage is finally easing, leading to stable GPU prices.",
        "A large-scale cybersecurity vulnerability was patched today, affecting millions of older operating systems.",
        "Silicon Valley's newest startup aims to revolutionize battery life in wearables, boasting a 10x increase in standby time."
    ],
    "Robotics": [
        "Automation News: Boston Dynamics shows off a new robot capable of sorting warehouse packages 50% faster than current models.",
        "Medical robotics breakthrough: Surgeons successfully completed a highly complex remote surgery using 5G and haptic feedback arms.",
        "New legislation is being discussed to regulate the deployment of autonomous delivery drones in heavy urban environments.",
        "Researchers have developed soft robotic muscles that mimic human tissue, bringing us closer to lifelike prosthetics."
    ],
    "General": [
        "Latest updates in the {tag} industry reveal some surprising shifts in consumer behavior this quarter.",
        "Breaking: Key leaders in the {tag} sector met today to discuss the future outlook and potential regulatory changes.",
        "A new report highlights the growing impact of globalization on {tag}, showing massive year-over-year growth.",
        "The recent developments in {tag} have sparked a massive debate online about the direction the industry is heading."
    ]
};

function generateContent(tag) {
    let templates = NEWS_TEMPLATES[tag] || NEWS_TEMPLATES["General"];
    let template = templates[Math.floor(Math.random() * templates.length)];
    return template.replace(/\{tag\}/g, tag);
}

function generateTitle(tag) {
    const newsPrefixes = [
        "Latest News:", "Breaking:", "Update:", "Report:", "Industry Insight:"
    ];
    return `${newsPrefixes[Math.floor(Math.random() * newsPrefixes.length)]} ${tag} Developments`;
}

async function seed() {
    try {
        await mongoose.connect(DB_URI);
        console.log("Connected to MongoDB.");

        console.log("Clearing existing posts...");
        await Post.deleteMany({});
        console.log("Cleared old posts.");

        const hashedPassword = await bcrypt.hash("12345", 10);
        
        for (const username of USERS) {
            let user = await User.findOne({ username });
            if (!user) {
                user = new User({
                    username,
                    email: `${username.toLowerCase()}@example.com`,
                    password: hashedPassword
                });
            } else {
                user.password = hashedPassword;
            }
            await user.save();
        }

        console.log("Seeding realistic news posts...");
        let postCount = 0;

        for (const username of USERS) {
            for (const tag of TAGS) {
                const title = generateTitle(tag);
                const content = generateContent(tag) + `\n\nReporting for BlogSphere by ${username}. Stay tuned for more ${tag} news.`;
                
                // Construct the post
                const postData = {
                    title,
                    content,
                    author: username,
                    tags: [tag],
                    createdAt: new Date(Date.now() - Math.random() * 10000000000)
                };

                // Add an image only ~60% of the time
                const addImage = Math.random() > 0.4;
                if (addImage) {
                    const lockId = Math.floor(Math.random() * 1000);
                    const query = encodeURIComponent(IMAGE_KEYWORD_MAP[tag] || tag);
                    postData.imageUrl = `https://loremflickr.com/800/400/${query}?lock=${lockId}`;
                }

                const post = new Post(postData);
                await post.save();
                postCount++;
            }
        }

        console.log(`Successfully seeded ${postCount} realistic news posts.`);
        
    } catch (err) {
        console.error("Error during seeding:", err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

seed();
