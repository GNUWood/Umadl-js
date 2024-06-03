const fs = require("node:fs/promises");
const MICROCMS_API_KEY = "xCZfLPNnbazeFHih87prlh1pomFsB1LFq6qZ";
const USER_AGENT = "curl/8.4.0";
const folders = ["制服", "勝負服", "原案", "Starting Future","トレセン学園関係者","不明"];

const header = {
    "Content-Type": "Application/json",
    "User-Agent": USER_AGENT,
    "x-microcms-api-key": MICROCMS_API_KEY
};

const output = String => {
    const time = new Date();
    console.log(`[${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}] ${String}`);
}

const download = (url, num, type, date) => new Promise(async (resolve) => {
    const data = await fetch(url);
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.writeFile(`./${date}/${folders[type]}/${num}.png`, buffer);
    resolve();
})

const createDir = async (date) => {
    try {
        await fs.access(date);
    } catch {
        await fs.mkdir(date);
    };
    for (folder of folders) {
        try {
            await fs.access(`./${date}/${folder}`);
        } catch {
            await fs.mkdir(`./${date}/${folder}`);
        };
    };
};

const main = async () => {
    const dateinfo = new Date();
    const date = `${dateinfo.getFullYear()}-${dateinfo.getMonth()}-${dateinfo.getDate()} ${dateinfo.getHours()}-${dateinfo.getMinutes()}`;
    createDir(date);

    const getCount = await fetch(`https://6azuq3sitt-aw4monxblm4y4x0oos66.microcms.io/api/v1/character`, {
        method: "GET",
        headers: header
    });

    const firstData = await getCount.json();
    const totalCount = firstData["totalCount"];

    const resp = await fetch(`https://6azuq3sitt-aw4monxblm4y4x0oos66.microcms.io/api/v1/character?limit=${totalCount}`, {
        method: "GET",
        headers: header
    });

    const character_list = await resp.json();

    output(`キャラクターリストの取得が完了しました。計${character_list["contents"].length}人`);
    await fs.writeFile("./characters.json", JSON.stringify(character_list, null, "    "), "utf8");

    let num = 1;
    let list = ""
    for (character of character_list["contents"]) {
        let tasks = Array();
        await new Promise(resolve => {
            for (task of character["visual"]) {
                let type;
                if (character["category"][0] == "ウマ娘") {
                    let id = task["name"]["id"]
                    if (id == "v-001") {
                        type = 0;
                    } else if (id == "v-002") {
                        type = 1;
                    } else if (id == "v-003") {
                        type = 2;
                    } else if (id == "v-004") {
                        type = 3;
                    } else {
                        type = 5;
                    };
                } else if (character["category"][0] == "トレセン学園関係者") {
                    type = 4;
                } else {
                    type = 5;
                };

                let image_url = task["image"]["url"];
                let charnum = String(num).padStart(String(character_list["contents"].length).length, 0);
                tasks.push(download(image_url, charnum, type, date));
            }

            Promise.all(tasks).then(() => {
                output(`ダウンロード完了：${character["name"]}`);
                list = list + `${String(num).padStart(String(character_list["contents"].length).length, 0)}: ${character["name"]}\n`
                num++;
                resolve();
            });

        });

    };
    await fs.writeFile("./id_list.txt", list, "utf8");

};
main();