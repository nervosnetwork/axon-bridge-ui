import { AmountWithoutDecimals } from '@force-bridge/commons';
import { BigNumber } from 'bignumber.js';

export type BeautyAmountFrom =
  | { decimals: number; amount?: AmountWithoutDecimals }
  | { info: { decimals: number }; amount?: AmountWithoutDecimals };

export type HumanizeOptions = { decimalPlaces?: number; separator?: boolean };

export class BeautyAmount {
  val: BigNumber;

  // decimals of an asset
  decimals: number;

  constructor(amount: AmountWithoutDecimals, decimals: number) {
    this.val = new BigNumber(amount);
    this.decimals = decimals;
  }

  static from(options: BeautyAmountFrom | AmountWithoutDecimals, decimals = 0): BeautyAmount {
    if (typeof options === 'string') {
      return new BeautyAmount(options, decimals);
    }
    if ('info' in options) {
      return new BeautyAmount(options.amount || '0', options.info.decimals);
    }
    return new BeautyAmount(options.amount || '0', options.decimals);
  }

  setVal(value: BigNumber | ((val: BigNumber) => BigNumber) | AmountWithoutDecimals): void {
    if (typeof value === 'function') {
      this.val = value(this.val);
      return;
    }

    this.val = new BigNumber(value);
  }

  humanize(options?: HumanizeOptions): string {
    const { decimalPlaces = Infinity, separator = true } = options ?? {};

    const valWithDecimals = this.val.times(10 ** -this.decimals);
    const originDecimalPlaces = valWithDecimals.decimalPlaces();

    const rounded = this.val.decimalPlaces(Math.min(originDecimalPlaces, decimalPlaces), BigNumber.ROUND_FLOOR);

    if (separator) return rounded.toFormat();
    return rounded.toString();
  }
}
