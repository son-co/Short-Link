import * as PATH from '@/routes/routesConfig';
export const Menus = [
  {
    path: PATH.ANALYTICS_STATISTICS_PATH,
    title: 'Analytics',
    icon: 'analytics',
    sibarMenu: [
      {
        path: PATH.ANALYTICS_STATISTICS_PATH,
        title: 'statistics',
        icon: 'analytics',
      },
    ],
  },
  // {
  //   path: 'â',
  //   title: 'data',
  //   icon: 'mail',
  // },
  {
    path: PATH.SEND_TEST_PATH,
    title: 'Send',
    icon: 'send',
    sibarMenu: [
      {
        path: PATH.SEND_TEST_PATH,
        title: 'Test',
        icon: 'analytics',
      },
      {
        path: PATH.SEND_SIGN_PATH,
        title: 'Sign',
        icon: 'analytics',
      },
      {
        path: PATH.SEND_TEMPLATE_PATH,
        title: 'SMS Templates',
        icon: 'analytics',
      },

      {
        path: PATH.SEND_CONTACT_PATH,
        title: 'Conntact List',
        icon: 'analytics',
      },
    ],
  },
  {
    path: PATH.SETTING_AUTHORIZATION_PATH,
    title: 'Settings',
    icon: 'cogs',
    sibarMenu: [
      {
        path: PATH.SETTING_AUTHORIZATION_PATH,
        title: 'Authorization',
        icon: 'analytics',
      },
    ],
  },
  {
    path: PATH.ACCOUNT_FINANCIAL_MANAGEMENT_PATH,
    title: 'Financial Mangement',
    icon: 'money',
    sibarMenu: [
      // {
      //   path: PATH.ACCOUNT_INFO_PATH,
      //   title: 'Info',
      //   icon: 'analytics',
      // },
      {
        path: PATH.ACCOUNT_FINANCIAL_MANAGEMENT_PATH,
        title: 'Financial Mangement',
        icon: 'analytics',
      },
    ],
  },
  // {
  //   path: 'abc',
  //   title: "User's Manual",
  //   icon: 'folder',
  // },
];

export const MenusUser = [
  // {
  //   path: PATH.ACCOUNT_INFO_PATH,
  //   title: 'Account',
  //   icon: 'cogs',
  //   sibarMenu: [
  //     // {
  //     //   path: PATH.ACCOUNT_INFO_PATH,
  //     //   title: 'Info',
  //     //   icon: 'analytics',
  //     // },
  //     {
  //       path: PATH.ACCOUNT_FINANCIAL_MANAGEMENT_PATH,
  //       title: 'Financial Mangement',
  //       icon: 'analytics',
  //     },
  //   ],
  // },
  // {
  //   path: '/teammates',
  //   title: 'Teammates',
  //   icon: 'user',
  // },
  // {
  //   path: '/certification',
  //   title: 'Certification',
  //   icon: 'check',
  // },
  {
    path: PATH.ACCOUNT_FINANCIAL_MANAGEMENT_PATH,
    title: 'Financial Management',
    icon: 'money',
    sibarMenu: [
      // {
      //   path: PATH.ACCOUNT_INFO_PATH,
      //   title: 'Info',
      //   icon: 'analytics',
      // },
      {
        path: PATH.ACCOUNT_FINANCIAL_MANAGEMENT_PATH,
        title: 'Financial Mangement',
        icon: 'analytics',
      },
    ],
  },
  // {
  //   path: '/message',
  //   title: 'Message',
  //   icon: 'bell',
  // },
  // {
  //   path: '/security',
  //   title: 'Security',
  //   icon: 'gear',
  // },
  // {
  //   path: '/ticket',
  //   title: 'Ticket',
  //   icon: 'file',
  // },
  {
    path: '/logout',
    title: 'Logout',
    icon: 'logout',
  },
];
