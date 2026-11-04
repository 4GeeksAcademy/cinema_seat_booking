# Implementation Plan

## Project Philosophy
- Keep the implementation simple, readable, and limited to the requested seat-booking behavior.
- Use a two-dimensional array as the sole seating data structure; do not use objects or classes for seats or the seating layout.
- Prefer the existing project setup and conventions. Add dependencies only if the existing setup cannot meet the specification.
- Keep the specification, acceptance criteria, and implementation plan as separate sources of truth. Do not invent acceptance criteria; the user will supply them.

## Steps
1. Read `SPEC.md`, `ACCEPTANCE_CRITERIA.md`, this plan, and the relevant existing app files before implementation. Preserve unrelated work.
2. Implement initialization of an 8-by-10 matrix with every seat set to `0`.
3. Implement seat reservation by row and column, changing an available seat from `0` to `1`.
4. Implement console output with row and column numbers, rendering `0` as `L` and `1` as `X`.
5. Implement the couples-seat search: scan rows and columns in order, return the first horizontal adjacent available pair, and clearly report when no pair exists.
6. Build the HTML and Tailwind interface with a clickable seat map and a couple-reservation button. Keep available and occupied counters fixed and visible at the bottom, and keep the interface synchronized with the matrix.
7. After implementation, read the user-provided acceptance criteria and test the behavior against each criterion. Do not claim acceptance validation is complete while that file is empty. Run only the focused checks needed for the implemented behavior and report any criteria that could not be verified.
