import { MockRequest } from '@delon/mock';

const list: any[] = [];
const total = 50;

for (let i = 0; i < total; i += 1) {
  list.push({
    id: i + 1,
    disabled: i % 6 === 0,
    href: 'https://ant.design',
    avatar: [
      'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
      'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
    ][i % 2],
    no: `TradeCode ${i}`,
    title: `task name ${i}`,
    owner: 'Tracy',
    description: 'a description',
    callNo: Math.floor(Math.random() * 1000),
    status: Math.floor(Math.random() * 10) % 4,
    updatedAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    createdAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    progress: Math.ceil(Math.random() * 100),
  });
}

function genData(params: any) {
  let ret = [...list];
  const pi = +params.pi;
  const ps = +params.ps;
  const start = (pi - 1) * ps;

  if (params.no) {
    ret = ret.filter(data => data.no.indexOf(params.no) > -1);
  }

  return { total: ret.length, list: ret.slice(start, ps * pi) };
}

function saveData(id: number, value: any) {
  const item = list.find(w => w.id === id);
  if (!item) return { msg: 'invalid user' };
  Object.assign(item, value);
  return { msg: 'ok' };
}

export const USERS = {
  '/user': (req: MockRequest) => genData(req.queryString),
  '/user/:id': (req: MockRequest) => list.find(w => w.id === +req.params.id),
  'POST /user/:id': (req: MockRequest) => saveData(+req.params.id, req.body),
  '/user/current': {
    name: 'Cipchk',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    userid: '00000001',
    email: 'admin@google.com',
    signature: 'make america better',
    title: 'web developer',
    group: 'census－adep－ead－step－mind benders',
    tags: [
      {
        key: '0',
        label: 'creative',
      },
      {
        key: '1',
        label: 'focus',
      },
      {
        key: '2',
        label: 'handsome~',
      },
      {
        key: '3',
        label: 'eat like a horse',
      },
      {
        key: '4',
        label: 'professional',
      },
      {
        key: '5',
        label: 'helpful',
      },
    ],
    notifyCount: 12,
    country: 'US',
    geographic: {
      province: {
        label: 'Maryland',
        key: '330000',
      },
      city: {
        label: 'Columbia',
        key: '330100',
      },
    },
    address: 'some number some road name',
    phone: 'guess',
  },
  'POST /user/avatar': 'ok',
  'POST /login/account': (req: MockRequest) => {
    const data = req.body;
    if (!(data.userName === 'admin' || data.userName === 'user') || data.password !== 'admin') {
      return { msg: `Invalid username or password（admin/admin）` };
    }
    return {
      msg: 'ok',
      user: {
        token: '123456789',
        name: data.userName,
        email: `${data.userName}@google.com`,
        id: 10000,
        time: +new Date(),
      },
    };
  },
  'POST /register': {
    msg: 'ok',
  },
};
