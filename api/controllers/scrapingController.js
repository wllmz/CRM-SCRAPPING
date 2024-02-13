const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeScienceCategory() {
    try {
        // Step 1: Get subcategory links from the main category page
        const mainCategoryUrl = 'https://en.wikipedia.org/wiki/Category:Science';
        const mainCategoryResponse = await axios.get(mainCategoryUrl);
        const $mainCategory = cheerio.load(mainCategoryResponse.data);

        const subcategoryLinks = [];
        $mainCategory('.CategoryTreeItem a').each((index, element) => {
            const link = $(element).attr('href');
            subcategoryLinks.push(link);
        });

        // Step 2: Visit each subcategory and scrape page titles
        for (const subcategoryLink of subcategoryLinks) {
            const subcategoryUrl = `https://en.wikipedia.org${subcategoryLink}`;
            const subcategoryResponse = await axios.get(subcategoryUrl);
            const $subcategory = cheerio.load(subcategoryResponse.data);

            const subcategoryTitles = [];
            $subcategory('.mw-category-group h3').each((index, element) => {
                const title = $(element).text();
                subcategoryTitles.push(title);
            });

            // Step 3: Scrape titles from each page in the subcategory
            for (const title of subcategoryTitles) {
                const pageUrl = `https://en.wikipedia.org/wiki/${title}`;
                const pageResponse = await axios.get(pageUrl);
                const $page = cheerio.load(pageResponse.data);

                const h2Titles = [];
                $page('h2').each((index, element) => {
                    const h2Title = $(element).text();
                    h2Titles.push(h2Title);
                });

                console.log(`Titles from page ${title}:`, h2Titles);
            }
        }
    } catch (error) {
        console.error("Error retrieving page content:", error);
    }
}



module.exports = {
  scrapeScienceCategory
};
