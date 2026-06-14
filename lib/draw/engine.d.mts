export type Entry = { id: string; groupSize?: number };
export type Winner = { id: string; groupSize: number; seats: number };

export type DrawInput = {
  entries: Entry[];
  poolChf: number;
  refCostChf: number;
  randomnessHex: string;
};

export type DrawResult = {
  winners: Winner[];
  winnerCount: number;
  seatsFunded: number;
  spentChf: number;
  rolloverChf: number;
  commitment: string;
  randomnessHex: string;
  sealedEntries: { id: string; groupSize: number }[];
};

export function runDraw(input: DrawInput): Promise<DrawResult>;
