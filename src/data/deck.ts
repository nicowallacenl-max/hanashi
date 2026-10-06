// Starter N3 vocabulary deck. Furigana notation: 漢字{かんじ}.
export type Card = {
  id: string;
  word: string;
  reading: string;
  en: string; // shown only behind the 英 marker
  example: string;
  exampleEn: string;
};

export const deck: Card[] = [
  { id: 'junbi', word: '準備', reading: 'じゅんび', en: 'preparation, getting ready', example: '旅行{りょこう}の準備{じゅんび}はもうできましたか。', exampleEn: 'Are you ready for your trip yet?' },
  { id: 'keiken', word: '経験', reading: 'けいけん', en: 'experience', example: '海外{かいがい}で働{はたら}いた経験{けいけん}があります。', exampleEn: 'I have experience working abroad.' },
  { id: 'soudan', word: '相談', reading: 'そうだん', en: 'consultation, talking something over', example: '先生{せんせい}に相談{そうだん}してみます。', exampleEn: "I'll try talking it over with my teacher." },
  { id: 'hitsuyou', word: '必要', reading: 'ひつよう', en: 'necessary, needed', example: 'パスポートが必要{ひつよう}です。', exampleEn: 'A passport is required.' },
  { id: 'yakusoku', word: '約束', reading: 'やくそく', en: 'promise; arrangement to meet', example: '友達{ともだち}と三時{さんじ}に会{あ}う約束{やくそく}をした。', exampleEn: 'I arranged to meet a friend at three.' },
  { id: 'chikoku', word: '遅刻', reading: 'ちこく', en: 'being late', example: '電車{でんしゃ}が遅{おく}れて、遅刻{ちこく}しました。', exampleEn: 'The train was delayed, so I was late.' },
  { id: 'setsumei', word: '説明', reading: 'せつめい', en: 'explanation', example: 'もう一度{いちど}説明{せつめい}してください。', exampleEn: 'Please explain it once more.' },
  { id: 'keshiki', word: '景色', reading: 'けしき', en: 'scenery, view', example: '山{やま}の上{うえ}から見{み}る景色{けしき}はきれいだ。', exampleEn: 'The view from the top of the mountain is beautiful.' },
  { id: 'shuukan', word: '習慣', reading: 'しゅうかん', en: 'habit, custom', example: '毎朝{まいあさ}走{はし}るのが習慣{しゅうかん}です。', exampleEn: 'Running every morning is my habit.' },
  { id: 'zannen', word: '残念', reading: 'ざんねん', en: 'a pity, disappointing', example: '雨{あめ}で試合{しあい}が中止{ちゅうし}になって残念{ざんねん}だ。', exampleEn: "It's a shame the match was cancelled because of rain." },
  { id: 'koutsuu', word: '交通', reading: 'こうつう', en: 'traffic, transport', example: 'この町{まち}は交通{こうつう}が便利{べんり}です。', exampleEn: 'Getting around this town is convenient.' },
  { id: 'todoku', word: '届く', reading: 'とどく', en: 'to arrive, be delivered', example: '荷物{にもつ}が届{とど}きました。', exampleEn: 'The package has arrived.' },
];
