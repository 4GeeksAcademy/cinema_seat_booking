# Cinema Seat Booking Specification

## Goal
Build a simple cinema seat manager that shows a screening room and lets users reserve individual seats or the first available adjacent pair.

## Seating Data
- The screening room has 8 rows and 10 seats per row.
- Initialize the seating matrix as a two-dimensional array containing `0` for every available seat.
- Use `0` for available seats and `1` for occupied seats.
- Accept row and column positions as 1-based numbers, matching the labels shown in the interface.
- Do not use objects or classes to represent seating data. Use a two-dimensional array only. If additional reservation metadata is needed, represent it as JSON.

## Required Behavior
- Provide a function that initializes the seating matrix.
- Provide a function that prints the current matrix to the console, using `L` for available seats and `X` for occupied seats. Include row and column numbers so positions are identifiable.
- Provide a function that reserves a seat from its row and column by changing its value from `0` to `1`.
- Reject a reservation if its row or column is out of range or the seat is already occupied; leave the matrix unchanged in that case.
- Provide a function for the couples-seat action that searches horizontally within each row for two adjacent available seats. Return the first pair found; if none exists, clearly indicate that no pair is available.
- If no adjacent pair is available, leave the matrix and counters unchanged and show a clear message in the interface.

## User Interface
- Build a simple web interface using HTML and Tailwind CSS.
- Show a visual seat map with row and column positions. Users can click an available seat to reserve it.
- Provide a button to reserve two adjacent seats for a couple.
- Keep occupied-seat and available-seat counters visible at the bottom of the interface at all times.
- Make unavailable seats visually distinct and prevent them from being reserved again.
