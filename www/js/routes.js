
var routes = [
  {
    name: '/home/',
    path: './index.html',
  },
  {
    path: '/report/',
    url: './report.html',
  },
  {
    path: '/company_meeting/',
    url: './company_meeting.html',
  },
  {
    path: '/login/',
    url: './login.html'
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
