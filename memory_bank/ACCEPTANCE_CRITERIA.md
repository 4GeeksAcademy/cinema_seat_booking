## Assessment Criteria

- Correct use of a two-dimensional array (matrix) to represent the cinema seating
- Proper implementation of functions with parameters and return values
- Correct use of conditional statements (if, else) to validate seat availability
- Correct use of loops (for, while) to process and display the seating matrix

## Core Functionality Tests

- [x] The page displays an 8-row by 10-seat map with row and column positions.
- [x] Available and occupied seat counters are visible at the bottom of the page.
- [x] Booking an available individual seat marks that seat occupied and updates both counters.
- [x] Booking a couples pair reserves the first two adjacent available seats in the same row and updates both counters.
- [x] When no adjacent available pair exists, the page clearly indicates that a couple booking cannot be made and does not change the seating matrix or counters.
- [x] An occupied seat cannot be selected or booked again, and the counters remain unchanged.
- [x] Booking one seat does not change the state of any other seat.
- [x] The displayed seat map and counters stay synchronized with the seating matrix after each booking.
