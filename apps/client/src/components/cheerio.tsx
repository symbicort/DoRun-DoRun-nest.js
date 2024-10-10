import { useEffect } from "react";
import axios from "axios";
import cheerio from "cheerio";

export default function CheerioExample() {

    useEffect(() => {
        const main = async () => {
            const url = 'https://devscb.com/';
            const response = await axios.get(url, {withCredentials: true});
            const html = response.data;

            
            const $ = cheerio.load(html);


            const title = $('title').text();
            console.log('Title:', title);

        
            $('.post-preview').each((index, element) => {
                const postTitle = $(element).find('h2').text();
                const postLink = $(element).find('a').attr('href');
                console.log('Post Title:', postTitle);
                console.log('Post Link:', postLink);
            });
        };
        main();
    }, []);

    return (
        <>
         
        </>
    );
}
