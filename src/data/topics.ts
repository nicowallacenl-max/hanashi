// Daily conversation topics. One is picked per day on the home screen.
export type Topic = {
  id: string;
  title: string; // Japanese, may use furigana notation
  en: string;
  grammar: string; // target grammar points
  opener: { ja: string; en: string };
};

export const topics: Topic[] = [
  {
    id: 'weekend',
    title: '週末{しゅうまつ}の予定{よてい}について話{はな}してみよう',
    en: "Let's talk about your weekend plans",
    grammar: '～たら / ～つもり',
    opener: { ja: 'こんにちは！今週末{こんしゅうまつ}は何{なに}か予定{よてい}がありますか？', en: 'Hi! Do you have any plans this weekend?' },
  },
  {
    id: 'food',
    title: '好{す}きな料理{りょうり}について話{はな}そう',
    en: "Let's talk about food you like",
    grammar: '～ようになる / ～ことがある',
    opener: { ja: '最近{さいきん}、何{なに}かおいしいものを食{た}べましたか？', en: 'Have you eaten anything tasty lately?' },
  },
  {
    id: 'travel',
    title: '旅行{りょこう}の思{おも}い出{で}を話{はな}そう',
    en: "Let's talk about a trip you remember",
    grammar: '～たことがある / ～ながら',
    opener: { ja: '今{いま}までで一番{いちばん}楽{たの}しかった旅行{りょこう}はどこですか？', en: 'Where was the most fun trip you have taken?' },
  },
  {
    id: 'work',
    title: '仕事{しごと}の一日{いちにち}を説明{せつめい}しよう',
    en: 'Describe a day at work',
    grammar: '～てから / ～ばかり',
    opener: { ja: '普段{ふだん}、仕事{しごと}の日{ひ}はどんなふうに過{す}ごしていますか？', en: 'How do you usually spend a workday?' },
  },
  {
    id: 'hobby',
    title: '趣味{しゅみ}について話{はな}そう',
    en: "Let's talk about your hobbies",
    grammar: '～ために / ～ようにしている',
    opener: { ja: '暇{ひま}な時{とき}は何{なに}をするのが好{す}きですか？', en: 'What do you like to do in your free time?' },
  },
];

export function topicForToday(d = new Date()) {
  const start = new Date(d.getFullYear(), 0, 0).getTime();
  const dayOfYear = Math.floor((d.getTime() - start) / 86_400_000);
  return topics[dayOfYear % topics.length];
}
