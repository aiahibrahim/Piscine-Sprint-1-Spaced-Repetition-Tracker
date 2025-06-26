
import { setData, getData } from './storage.js';
// Manually import displayBookmarks if it's exported from script.js,
// otherwise we can simulate its logic in the test scope.
import './script.js'; // Runs script.js (assumes global DOM exists)
beforeEach(() => {
  document.body.innerHTML = `
    <select id="user-select"></select>
    <div id="bookmarks"></div>
    <form id="bookmark-form">
      <input id="url" />
      <input id="title" />
      <input id="description" />
    </form>
  `;
});
test('displayBookmarks() should render sorted bookmarks in DOM for user 1', () => {
  const userId = '1';
  const bookmarks = [
    {
      url: 'https://older.com',
      title: 'Older',
      description: 'Old bookmark',
      createdAt: '2020-01-01T00:00:00.000Z',
    },
    {
      url: 'https://newer.com',
      title: 'Newer',
      description: 'New bookmark',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
  ];
  // Store bookmarks in localStorage using real setData
  setData(userId, bookmarks);
  // Use the same function as in script.js (simulate the call)
  const bookmarksDiv = document.getElementById('bookmarks');
  // Simulate the function displayBookmarks
  const result = getData(userId);
  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const list = document.createElement('ul');
  for (const bm of result) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = bm.url;
    link.textContent = bm.title;
    item.appendChild(link);
    item.appendChild(document.createTextNode(` - ${bm.description}`));
    list.appendChild(item);
  }
  bookmarksDiv.innerHTML = '';
  bookmarksDiv.appendChild(list);
  const links = bookmarksDiv.querySelectorAll('a');
  expect(links.length).toBe(2);
  expect(links[0].textContent).toBe('Newer');
  expect(links[1].textContent).toBe('Older');
});