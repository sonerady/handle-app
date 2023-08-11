import { v4 as uuidv4 } from 'uuid';

export const data = [
  {
    id: '1',
    Task: 'https://hips.hearstapps.com/hmg-prod/images/2023-genesis-gv60-112-1652724064.jpg?crop=0.418xw:0.417xh;0.461xw,0.435xh&resize=640:*',

    Prompt : 'Red car in the middle of the road',
    Due_Date: '25-May-2020',
  },
  {
    id: '2',
    Task: 'https://hips.hearstapps.com/hmg-prod/images/2023-genesis-gv60-112-1652724064.jpg?crop=0.418xw:0.417xh;0.461xw,0.435xh&resize=640:*',

    Prompt : 'Flower drawing on the wall',
    Due_Date: '26-May-2020',
  },
  {
    id: '3',
    Task: 'https://hips.hearstapps.com/hmg-prod/images/2023-genesis-gv60-112-1652724064.jpg?crop=0.418xw:0.417xh;0.461xw,0.435xh&resize=640:*',

    Prompt : 'Red car in the middle of the road',
    Due_Date: '27-May-2020',
  },
  {
    id: '4',
    Task: 'https://hips.hearstapps.com/hmg-prod/images/2023-genesis-gv60-112-1652724064.jpg?crop=0.418xw:0.417xh;0.461xw,0.435xh&resize=640:*',

    Prompt : 'Red car in the middle of the road',
    Due_Date: '23-Aug-2020',
  },
  {
    id: '5',
    Task: 'https://hips.hearstapps.com/hmg-prod/images/2023-genesis-gv60-112-1652724064.jpg?crop=0.418xw:0.417xh;0.461xw,0.435xh&resize=640:*',

    Prompt : 'Flower drawing on the wall',
    Due_Date: '05-Jan-2021',
  },
 
 
];

export const columnsFromBackend = {
  [uuidv4()]: {
    title: 'Your Images',
    items: data,
  },
  [uuidv4()]: {
    title: 'Nft',
    items: [],
  },
  [uuidv4()]: {
    title: 'My Project-1',
    items: [],
  },
  [uuidv4()]: {
    title: 'My Project-2',
    items: [],
  },
  [uuidv4()]: {
    title: 'My Project-3',
    items: [],
  },
};
