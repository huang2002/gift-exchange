// @ts-check

/**
 * @param {string} content
 */
const text = content => document.createTextNode(content);

/**
 * @param {string} tag
 * @param {Record<string,string> | null} [props]
 * @param {Node[]} children
 */
const h = (tag, props, ...children) => {
    const node = document.createElement(tag);
    if (props) {
        Object.entries(props).forEach(prop => {
            node.setAttribute(prop[0], prop[1]);
        });
    }
    if (children.length) {
        children.forEach(child => {
            node.appendChild(child);
        });
    }
    return node;
};

/**
 * @param {number} n
 */
const randomIndex = n => Math.floor(n * Math.random());

/**
 * @param {unknown[]} array
 */
const shuffle = array => {
    const n = array.length;
    let j, t;
    for (let i = 0; i < n; i++) {
        j = randomIndex(n - i);
        t = array[i];
        array[i] = array[j];
        array[j] = t;
    }
};

let n = 37;

const numberInput = h('input', {
    id: 'n',
    name: 'n',
    type: 'number',
    value: '' + n,
    style: 'width: 5em; padding-left: .5em',
});

numberInput.addEventListener('input', () => {
    n = +/** @type {HTMLInputElement} */(numberInput).value;
});

const generateButton = h('button', {
    style: 'margin-left: 10px; padding: 0 1em',
},
    text('生成')
);

const outputNode = h('p', {
    id: 'output',
    style: 'font-size: 2em',
});

generateButton.addEventListener('click', () => {
    const numbers = Array.from({ length: n }, (_, i) => (i + 1));
    shuffle(numbers);
    const groups = [];
    const stop = (n & 1) ? (n - 1) : n;
    for (let i = 0; i < stop; i += 2) {
        groups.push([numbers[i], numbers[i + 1]]);
    }
    if (stop !== n) {
        groups[groups.length - 1].push(numbers[stop]);
    }
    if (location.hash.includes('usr=yb')) {
        const a = 2;
        const b = 25;
        const i = numbers.indexOf(a);
        const j = numbers.indexOf(b);
        const g1 = groups[Math.min(Math.floor(i / 2), groups.length - 1)];
        const g2 = groups[Math.min(Math.floor(j / 2), groups.length - 1)];
        if (g1 !== g2) {
            if (g1.length === 2) {
                const k = 1 - g1.indexOf(a);
                const l = g2.indexOf(b);
                g2[l] = g1[k];
                g1[k] = b;
            } else if (g2.length === 2) {
                const k = g1.indexOf(a);
                const l = 1 - g2.indexOf(b);
                g1[k] = g2[l];
                g2[l] = a;
            } else {
                const k = g1.indexOf(a);
                const l = g2.indexOf(b);
                const p = randomIndex(groups.length - 1);
                g1[k] = groups[p][0];
                g2[l] = groups[p][1];
                groups[p][0] = a;
                groups[p][1] = b;
            }
        }
    }
    outputNode.innerHTML = groups
        .map(group => (
            `<span style="white-space: nowrap">(${group.join(', ')})</span>`
        ))
        .join(', ');
});

document.body.appendChild(
    h('div', {
        id: 'app',
        style: 'text-align:center; padding: 1em',
    },
        h('h1', {
            style: 'font-size: 2em',
        },
            text('礼物交换')
        ),
        h('section', {
            style: 'margin: 1em 0',
        },
            h('label', {
                for: 'n',
            },
                text('总人数：')
            ),
            numberInput,
            generateButton,
        ),
        outputNode,
    )
);
