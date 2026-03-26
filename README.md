# Logic Gate Simulator

> A web-based digital circuit simulator for designing and simulating
> digital logic circuits in real time.

## 🚀 Live Demo
*Coming soon*

## Features
- 7 basic logic gates: AND, OR, NOT, NAND, NOR, XOR, XNOR
- Drag-and-drop circuit building on an interactive canvas
- Real-time event-driven signal propagation
- Combinational circuits: Half Adder, Full Adder, MUX, Decoder
- Sequential circuits: SR Latch, D Flip-Flop, 4-bit Counter
- Save and load circuits as JSON

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 18 |
| Canvas | React Flow |
| State Management | Zustand |
| Styling | Tailwind CSS |
| Build Tool | Vite |
| Testing | Vitest |

## Getting Started
```bash
# Clone the repository
git clone https://github.com/atuls80443/logic-gate-simulator.git

# Install dependencies
cd logic-gate-simulator
npm install

# Start development server
npm run dev
```

## Project Structure
```
src/
├── components/    # React visual components
├── simulator/     # Pure simulation engine (no React)
├── store/         # Zustand state management
├── hooks/         # Custom React hooks
└── utils/         # Helper functions
```

## Running Tests
```bash
npm run test
```

## Development Roadmap
- [x] Phase 1: Project setup and architecture
- [X] Phase 2: Simulation engine and gate logic
- [X] Phase 3: Canvas, wiring, and signal propagation
- [X] Phase 4: Combinational circuits
- [ ] Phase 5: Sequential circuits
- [ ] Phase 6: Save/load and polish

## License
MIT
