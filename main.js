/**
 * @typedef {Object} ProjectItem
 * @property {string} name
 * @property {string} href
 * @property {string} repo
 * @property {string[]} icons
 * @property {string} desc
 * @property {boolean} [siteComingSoon]
 *
 * @typedef {Object} CategoryGroup
 * @property {string} category
 * @property {ProjectItem[]} [items]
 * @property {boolean} [isComingSoon]
 */
/** @type {CategoryGroup[]} */
const projects = [
  {
    category: "Games",
    items: [
      { name: "ElectroSnake 3D", href: "electrosnake-3d/", repo: "electrosnake-3d", 
        icons: [getIcon("typescript", "3178C6"), getIcon("threedotjs", "000000")],
        desc: "Basic game-engine experimentation with Three.js. Touch or keyboard controls." }
    ]
  },
  {
    category: "Graph Traversal",
    items: [
      { name: "Mario Kart World Path Generator", href: "mkw-pathgen/", repo: "mkw-pathgen",
        icons: [getIcon("html5", "E34F26"), getIcon("typescript", "3178C6")],
        desc: "Uses depth-first-search to generate unique paths of varying lengths in Mario Kart World." },
      { name: "AFL Parity", href: "afl-parity/", repo: "afl-parity", siteComingSoon: true,
        icons: [getIcon("python", "3776AB")],
        desc: "Uses depth-first-search to discover Hamiltonian Paths in AFL seasons." }
    ]
  },
{
    category: "Graphics",
    isComingSoon: true
  },
  {
    category: "Systems (AI/ML)",
    isComingSoon: true
  },
  {
    category: "Trackers",
    items: [
      { 
        name: "Wingspan H2H Data", 
        href: "wingspan-h2h-data/", 
        repo: "wingspan-h2h-data",
        icons: [getIcon("html5", "E34F26"), getIcon("typescript", "3178C6")],
        desc: "Collecting and analyzing head-to-head match data for the board game Wingspan between the wifey and myself."
      },
      { 
        name: "Lossless {game}", 
        href: "lossless/", 
        repo: "lossless",
        icons: [getIcon("html5", "E34F26"), getIcon("css", "663399"), getIcon("javascript", "F7DF1E")],
        desc: `Publicly documenting our feeble attempts at completing old games without losing a single life while drinking <span class="tooltip" data-tooltip="XXXX Gold Longneck with a Negroni dropped into it">Negroni-Bombs</span>.`
      }
    ]
  }
];

function getIcon(name, color) {
  return `<img src="https://cdn.simpleicons.org/${name}/${color}" alt="${name}" title="${name}" />`;
}

function getPreable() {
    return `
    <p class="intro-text">
          Most of my work is private because I'm super special and no one should
          witness my code.
    </p>`
}

function render() {
  // sidebar first
  const sidebar = document.getElementById('sidebar-content');
  sidebar.innerHTML = projects.map(section => `
    <div class="menu-group">
      <summary>${section.category}</summary>
      ${section.items ? `
        <ul>
          ${section.items.map(item => `
            <li><a href="#item-${item.repo}">${item.name}</a></li>
          `).join('')}
        </ul>
      ` : ''}
    </div>
  `).join('');

  // main body
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = getPreable() + projects.map(section => `
    <h2>${section.category}</h2>
    <ul class="item-list">
      ${section.isComingSoon 
        ? `<li class="coming-soon-text" style="list-style: none; padding: 12px 15px;">Coming Soon!</li>` 
        : section.items.map(item => `
        <li id="item-${item.repo}">
          <a class="item-title" href="${item.href}">${item.name}</a>
          ${item.siteComingSoon ? '<span class="coming-soon-text">Site Coming Soon!</span>' : ''}
          <div class="icon-list">
            <a href="https://github.com/mctipper/${item.repo}" target="_blank" rel="noopener">
              <img src="https://cdn.simpleicons.org/github/181717" alt="GitHub Repo" title="GitHub Repo"/>
            </a>
            <span class="sep">|</span>
            ${item.icons.join('')}
          </div>
          <div class="item-desc"><p>${item.desc}</p></div>
        </li>
      `).join('')}
    </ul>
  `).join('');
}

render();
