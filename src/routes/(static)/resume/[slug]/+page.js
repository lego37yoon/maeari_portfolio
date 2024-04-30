import { error } from '@sveltejs/kit'

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
    try {
        const resumeSetupData = await fetch(`/api/document?type=resume&purpose=${params.slug}`);
        const resumeSetupJson = await resumeSetupData.json();
        const resumeEmail = 
            await fetch(`/api/document?type=contact&purpose=email&account=${resumeSetupJson.email}&provider=${resumeSetupJson["email-provider"]}`);
        const resumeDev =
            await fetch(`/api/document?type=contact&purpose=dev&account=${resumeSetupJson.git}&provider=${resumeSetupJson["git-provider"]}`);

        const dataset = {
            title: "기본",
            content: {}
        };

        if (resumeSetupJson.introduce) {
            const introduce = await import(`../../../../contents/resume/${params.slug}.md`);
            
            dataset.title = introduce.metadata.title;
            dataset.role = introduce.metadata.role
            dataset.content.introduce = introduce.default; 
        } else {
            dataset.title = resumeSetupJson.title;
            dataset.role = resumeSetupJson.role;
        }
        dataset.email = await resumeEmail.text();
        dataset.dev = await resumeDev.json();

        const dataToFetch = resumeSetupJson.include.map(async (collection) => {
            const entryData = await fetch(`/api/data?type=${collection}`);
            dataset.content[collection] = await entryData.json();
        });
        await Promise.all(dataToFetch);

        return dataset;
    } catch(e) {
        error(404, `${params.slug} 페이지의 데이터를 찾지 못했습니다.`);
    }
}