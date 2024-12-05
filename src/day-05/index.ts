import { readFileSync } from "fs";

const file = readFileSync("./src/day-05/input.txt", "utf-8");

const [rules, pages] = file.split("\n\n");

type Page = {
    page: string;
    follwingPages: Page[];
};

const allPages: Page[] = [];

for (const rule of rules.split("\n")) {
    const [p1, p2] = rule.split("|");

    if (!getPage(p1)) {
        allPages.push({
            page: p1,
            follwingPages: [],
        });
    }

    if (!getPage(p2)) {
        allPages.push({
            page: p2,
            follwingPages: [],
        });
    }
}

for (const rule of rules.split("\n")) {
    const [page, following] = rule.split("|");

    const currentPage = getPage(page);

    const folliwngPage = getPage(following);

    if (!currentPage || !folliwngPage) continue;

    currentPage.follwingPages.push(folliwngPage);
}

function getPage(pageName: string): Page | undefined {
    return allPages.find((p) => p.page === pageName);
}

function isValidOrder(pages: Page[], page: Page | undefined) {
    if (!page) return true;

    for (const p of pages) {
        if (page.follwingPages.find((i) => i.page === p.page)) {
            return false;
        }
    }

    return true;
}

function orderPages(pages: Page[]) {
    pages.sort((pA, pB) => {
        if (pA.follwingPages.find((p) => p.page === pB.page)) {
            return 1;
        }

        return -1;
    });
}

function partOne(): void {
    let sumOfMiddle = 0;

    for (const pageLine of pages.split("\n")) {
        const previousPages: Page[] = [];

        let isAllValid = true;

        for (const pageName of pageLine.split(",")) {
            const page = getPage(pageName)!;

            if (!isValidOrder(previousPages, page)) {
                isAllValid = false;
            }

            previousPages.push(page);
        }

        if (isAllValid) {
            const middlePage =
                previousPages[Math.floor(previousPages.length / 2)].page;

            sumOfMiddle += Number(middlePage);
        }
    }

    console.log(sumOfMiddle);
}

function partTwo(): void {
    let sumOfMiddle = 0;

    const incorrectPageOrders: Page[][] = [];

    for (const pageLine of pages.split("\n")) {
        const previousPages: Page[] = [];

        let isAllValid = true;

        for (const pageName of pageLine.split(",")) {
            const page = getPage(pageName)!;

            if (!isValidOrder(previousPages, page)) {
                isAllValid = false;
            }

            previousPages.push(page);
        }

        if (!isAllValid) {
            incorrectPageOrders.push(previousPages);
        }
    }

    for (const pageOrder of incorrectPageOrders) {
        orderPages(pageOrder);
        const middlePage = pageOrder[Math.floor(pageOrder.length / 2)].page;
        sumOfMiddle += Number(middlePage);
    }

    console.log(sumOfMiddle);
}

partOne();
partTwo();

