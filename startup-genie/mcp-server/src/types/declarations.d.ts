declare module 'sentiment' {
  interface SentimentResult {
    score: number;
    comparative: number;
    tokens: string[];
    positive: string[];
    negative: string[];
  }

  class Sentiment {
    analyze(text: string): SentimentResult;
  }

  export = Sentiment;
}

declare module 'ml-regression' {
  export class LinearRegression {
    constructor(x: number[][], y: number[]);
    train(): void;
    predict(x: number[]): number;
  }
}

declare module 'ml-kmeans' {
  interface KMeansResult {
    clusters: number[][];
    centroids: number[][];
    iterations: number;
  }

  export function kmeans(data: number[][], k: number): KMeansResult;
}

declare module 'compromise' {
  interface CompromiseDoc {
    normalize(): CompromiseDoc;
    text(): string;
  }

  function compromise(text: string): CompromiseDoc;
  export = compromise;
}

declare module 'technicalindicators' {
  interface SMAInput {
    period: number;
    values: number[];
  }

  interface RSIInput {
    period: number;
    values: number[];
  }

  interface MACDInput {
    fastPeriod: number;
    slowPeriod: number;
    signalPeriod: number;
    values: number[];
  }

  export const SMA: {
    calculate(input: SMAInput): number[];
  };

  export const RSI: {
    calculate(input: RSIInput): number[];
  };

  export const MACD: {
    calculate(input: MACDInput): Array<{
      MACD: number;
      signal: number;
      histogram: number;
    }>;
  };
}
