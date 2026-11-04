const ROW_COUNT = 8;
const SEAT_COUNT = 10;

export function initializeSeatingMatrix(): number[][] {
  return Array.from({ length: ROW_COUNT }, () => Array<number>(SEAT_COUNT).fill(0));
}

export function displaySeatingMatrix(matrix: number[][]): void {
  const columnLabels = Array.from({ length: SEAT_COUNT }, (_, index) => String(index + 1).padStart(2, " ")).join(" ");
  const lines = [`    ${columnLabels}`];

  for (let rowIndex = 0; rowIndex < matrix.length; rowIndex += 1) {
    let row = `${String(rowIndex + 1).padStart(2, " ")}  `;

    for (let columnIndex = 0; columnIndex < matrix[rowIndex].length; columnIndex += 1) {
      row += `${matrix[rowIndex][columnIndex] === 1 ? "X" : "L"}  `;
    }

    lines.push(row);
  }

  console.log(lines.join("\n"));
}

export function reserveSeat(matrix: number[][], rowNumber: number, columnNumber: number): boolean {
  if (
    !Number.isInteger(rowNumber) ||
    !Number.isInteger(columnNumber) ||
    rowNumber < 1 ||
    rowNumber > matrix.length ||
    columnNumber < 1 ||
    columnNumber > matrix[rowNumber - 1].length
  ) {
    return false;
  }

  if (matrix[rowNumber - 1][columnNumber - 1] === 1) {
    return false;
  }

  matrix[rowNumber - 1][columnNumber - 1] = 1;
  return true;
}

export function findAvailableCoupleSeats(matrix: number[][]): number[][] | null {
  for (let rowIndex = 0; rowIndex < matrix.length; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < matrix[rowIndex].length - 1; columnIndex += 1) {
      if (matrix[rowIndex][columnIndex] === 0 && matrix[rowIndex][columnIndex + 1] === 0) {
        return [
          [rowIndex + 1, columnIndex + 1],
          [rowIndex + 1, columnIndex + 2],
        ];
      }
    }
  }

  return null;
}

export function reserveCoupleSeats(matrix: number[][]): number[][] | null {
  const seats = findAvailableCoupleSeats(matrix);

  if (seats === null) {
    return null;
  }

  for (let seatIndex = 0; seatIndex < seats.length; seatIndex += 1) {
    reserveSeat(matrix, seats[seatIndex][0], seats[seatIndex][1]);
  }

  return seats;
}

function renderSeatMap(matrix: number[][]): string {
  const cells = ['<span class="seat-label seat-corner">ROW</span>'];

  for (let columnIndex = 0; columnIndex < SEAT_COUNT; columnIndex += 1) {
    cells.push(`<span class="seat-label" aria-hidden="true">${columnIndex + 1}</span>`);
  }

  for (let rowIndex = 0; rowIndex < matrix.length; rowIndex += 1) {
    const rowNumber = rowIndex + 1;
    cells.push(`<span class="seat-label row-label" aria-hidden="true">${rowNumber}</span>`);

    for (let columnIndex = 0; columnIndex < matrix[rowIndex].length; columnIndex += 1) {
      const columnNumber = columnIndex + 1;
      const occupied = matrix[rowIndex][columnIndex] === 1;
      const state = occupied ? "occupied" : "available";

      cells.push(
        `<button class="seat seat--${state}" type="button" data-row="${rowNumber}" data-column="${columnNumber}" aria-label="Row ${rowNumber}, seat ${columnNumber}, ${state}" title="Row ${rowNumber}, seat ${columnNumber}: ${state}" ${occupied ? "disabled" : ""}>${columnNumber}</button>`,
      );
    }
  }

  return `<div class="seat-grid" aria-label="Cinema seating map">${cells.join("")}</div>`;
}

function countSeats(matrix: number[][]): number[] {
  let available = 0;
  let occupied = 0;

  for (let rowIndex = 0; rowIndex < matrix.length; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < matrix[rowIndex].length; columnIndex += 1) {
      if (matrix[rowIndex][columnIndex] === 1) {
        occupied += 1;
      } else {
        available += 1;
      }
    }
  }

  return [available, occupied];
}

function startSeatManager(matrix: number[][]): void {
  const app = document.querySelector<HTMLElement>("#app");

  if (!app) {
    return;
  }

  app.innerHTML = `
    <div class="page-shell">
      <header class="topbar">
        <a class="wordmark" href="#" aria-label="Cinema seat manager home"><span class="wordmark-mark">C</span><span>SCREEN / 01</span></a>
        <span class="topbar-note">TICKETING CONSOLE</span>
      </header>

      <main class="booking-main">
        <div class="page-heading">
          <div>
            <p class="eyebrow">TONIGHT'S SCREENING</p>
            <h1>Seat manager</h1>
          </div>
          <p class="room-size">ROOM A <span>08 ROWS</span> <span>10 SEATS</span></p>
        </div>

        <section class="room-panel" aria-labelledby="map-title">
          <div class="screen" aria-label="Front of cinema">SCREEN</div>
          <div class="map-heading">
            <div>
              <h2 id="map-title">Choose your seats</h2>
              <p>Click an available seat to reserve it.</p>
            </div>
            <button id="couple-booking" class="couple-button" type="button"><span aria-hidden="true">2</span> Find seats for two</button>
          </div>
          <div id="seat-map" class="seat-map" aria-live="polite"></div>
          <div class="legend" aria-label="Seat legend">
            <span><i class="legend-seat legend-seat--available"></i>Available</span>
            <span><i class="legend-seat legend-seat--occupied"></i>Occupied</span>
          </div>
          <p id="booking-message" class="booking-message" role="status" aria-live="polite">Select a seat or find two together.</p>
        </section>
      </main>

      <footer class="seat-totals" aria-label="Seat availability">
        <div class="total-item"><span class="total-dot total-dot--available"></span><span class="total-label">Available</span><strong id="available-count">80</strong></div>
        <div class="total-divider"></div>
        <div class="total-item"><span class="total-dot total-dot--occupied"></span><span class="total-label">Occupied</span><strong id="occupied-count">0</strong></div>
        <span class="totals-caption">LIVE SEAT COUNT</span>
      </footer>
    </div>
  `;

  const seatMap = app.querySelector<HTMLElement>("#seat-map");
  const availableCount = app.querySelector<HTMLElement>("#available-count");
  const occupiedCount = app.querySelector<HTMLElement>("#occupied-count");
  const bookingMessage = app.querySelector<HTMLElement>("#booking-message");
  const coupleBookingButton = app.querySelector<HTMLButtonElement>("#couple-booking");

  if (!seatMap || !availableCount || !occupiedCount || !bookingMessage || !coupleBookingButton) {
    return;
  }

  const updateView = (): void => {
    seatMap.innerHTML = renderSeatMap(matrix);
    const counts = countSeats(matrix);
    availableCount.textContent = String(counts[0]);
    occupiedCount.textContent = String(counts[1]);
  };

  seatMap.addEventListener("click", (event: MouseEvent) => {
    const target = event.target;

    if (!(target instanceof HTMLButtonElement)) {
      return;
    }

    const rowNumber = Number(target.dataset.row);
    const columnNumber = Number(target.dataset.column);

    if (!reserveSeat(matrix, rowNumber, columnNumber)) {
      bookingMessage.textContent = "That seat is already occupied or unavailable.";
      return;
    }

    updateView();
    displaySeatingMatrix(matrix);
    bookingMessage.textContent = `Seat ${rowNumber}, ${columnNumber} reserved.`;
  });

  coupleBookingButton.addEventListener("click", () => {
    const seats = reserveCoupleSeats(matrix);

    if (seats === null) {
      bookingMessage.textContent = "No adjacent seats are available for a couple booking.";
      return;
    }

    updateView();
    displaySeatingMatrix(matrix);
    bookingMessage.textContent = `Seats ${seats[0][0]}, ${seats[0][1]} and ${seats[1][0]}, ${seats[1][1]} reserved.`;
  });

  updateView();
  displaySeatingMatrix(matrix);
}

if (typeof document !== "undefined") {
  import("./style.css").then(() => {
    startSeatManager(initializeSeatingMatrix());
  });
} else {
  displaySeatingMatrix(initializeSeatingMatrix());
}
