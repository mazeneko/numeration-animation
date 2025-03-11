import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  template: `
    <div class="flex flex-col">
      <div class="flex gap-4">
        <p>radix : {{ radix() }}</p>
        <button
          type="button"
          (click)="decrementRadix()"
          [disabled]="radix() === 2"
        >
          minus
        </button>
        <button
          type="button"
          (click)="incrementRadix()"
          [disabled]="radix() === 36"
        >
          plus
        </button>
      </div>
      <div class="flex gap-4">
        <p>count : {{ value() }}</p>
        <button
          type="button"
          (click)="decrementValue()"
          [disabled]="value() === 0"
        >
          minus
        </button>
        <button type="button" (click)="incrementValue()">plus</button>
        <button type="button" (click)="resetValue()">reset</button>
      </div>
      <div class="flex gap-4">
        <p>count in base {{ radix() }} : {{ numerationValue() }}</p>
      </div>
      <div class="flex gap-4">
        <label>showCellValue</label>
        <input type="checkbox" [(ngModel)]="showCellValue" />
      </div>
      <div class="flex gap-4">
        <label>useAlphabet</label>
        <input type="checkbox" [(ngModel)]="useAlphabet" />
      </div>
    </div>

    <div
      class="flex flex-col-reverse flex-wrap-reverse place-content-end"
      [style.height]="containerHeight() + 'px'"
    >
      @for (cell of cells(); track $index) {
        <div
          [style.width]="cellSize + 'px'"
          class="grid aspect-square place-content-center rounded-full text-xs"
          [class.bg-gray-400]="cell.show"
          [class.bg-gray-100]="!cell.show"
        >
          @if (showCellValue()) {
            @if (useAlphabet()) {
              {{ cell.value.toString(radix()) }}
            } @else {
              {{ cell.value }}
            }
          }
        </div>
      }
    </div>
  `,
  // TODO 最低限のスタイルだけとりあえずcomponentを作らずにstylesで書いています
  styles: `
    button,
    input {
      cursor: pointer;
    }
    button:hover {
      background-color: #f0f0f0;
    }
  `,
})
export class AppComponent {
  readonly showCellValue = signal(true);
  readonly useAlphabet = signal(false);
  readonly radix = signal(10);
  readonly cellCountPerCol = computed(() => this.radix() - 1);
  readonly cellSize = 32;
  readonly containerHeight = computed(
    () => this.cellCountPerCol() * this.cellSize,
  );
  readonly value = signal(0);
  readonly numerationValue = computed(() =>
    this.value().toString(this.radix()),
  );
  readonly cells = computed(() => {
    const cells: Cell[] = [];
    let remain = this.value();
    while (remain !== 0) {
      const cellCount = remain % this.radix();
      const tempCells = [...Array(this.cellCountPerCol())].map<Cell>((_, i) => {
        const value = i + 1;
        return {
          value,
          show: value <= cellCount,
        };
      });
      cells.push(...tempCells);
      remain = (remain - cellCount) / this.radix();
    }
    return cells;
  });

  incrementRadix(): void {
    this.radix.update((n) => n + 1);
  }

  decrementRadix(): void {
    this.radix.update((n) => n - 1);
  }

  incrementValue(): void {
    this.value.update((n) => n + 1);
  }

  decrementValue(): void {
    this.value.update((n) => n - 1);
  }

  resetValue(): void {
    this.value.set(0);
  }
}

interface Cell {
  value: number;
  show: boolean;
}
