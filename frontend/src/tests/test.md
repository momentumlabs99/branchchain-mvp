# Frontend Integration Testing Strategy

## Technology Stack

The testing suite is built using the following modern web testing technologies:

- **[Vitest](https://vitest.dev/)**: A blazing fast unit test framework powered by Vite. It is used as the test runner and provides assertion libraries (compatible with Jest).
- **[React Testing Library (RTL)](https://testing-library.com/docs/react-testing-library/intro/)**: A library for testing React components that encourages testing best practices. It allows testing components as users would interact with them (clicking buttons, filling forms) rather than testing implementation details.
- **[JSDOM](https://github.com/jsdom/jsdom)**: A lightweight browser implementation that runs in Node.js, allowing us to simulate a DOM environment for our React components.
- **[MSW (Mock Service Worker) / Vi.mock]**: We use Vitest's built-in `vi.mock` capabilities to intercept and mock API calls, ensuring tests are isolated from the backend.

## Test Scope & Coverage

We currently have comprehensive integration tests for the following core business workflows:

1.  **Authentication (`Login.test.jsx`)**
    -   Verifies successful login with valid credentials.
    -   Ensures error messages are displayed for invalid credentials.
    -   Tests input handling and form submission.

2.  **Card Replacement (`ReplaceCard.test.jsx`)**
    -   **Mocking**: Simulates `AccountLookup` component to bypass complex lookup logic and focus on the card replacement flow.
    -   Verifies the UI updates correctly when an account is found (card details displayed).
    -   Tests successful card replacement API calls with correct payload.
    -   Ensures proper error handling during API failures.

3.  **KYC Updates (`UpdateKYC.test.jsx`)**
    -   **Mocking**: Simulates `AccountLookup` to provide a controlled customer object.
    -   Verifies form population with existing customer data.
    -   Tests user modifications to fields (Email, Address, City).
    -   Asserts that the `updateCustomerKYC` API is called with the merged data.

4.  **Audit Logs (`AuditLog.test.jsx`)**
    -   Tests the loading state and empty states.
    -   Verifies that audit log entries are rendered correctly (transforming raw API data to UI-friendly format).
    -   Tests client-side interactions like filtering by Action Type (e.g., "LOGIN").
    -   Simulates API errors to ensure graceful failure messages.

## Testing Methodology

A shift-left, behavior-driven approach is used:

1.  **Arrange**: Render the component into the virtual JSDOM. Set up necessary mocks (API responses, child components) to simulate specific scenarios (Success, Error, Loading).
2.  **Act**: Use `fireEvent` from RTL to simulate real user actions:
    -   Clicking buttons (`fireEvent.click`).
    -   Typing into inputs (`fireEvent.change`).
    -   Selecting options in dropdowns.
3.  **Assert**: Verify the expected outcome:
    -   **DOM changes**: Checking if success messages or error alerts appear (`toBeInTheDocument`).
    -   **API Calls**: Verifying that the backend API function was called with the exact expected arguments (`toHaveBeenCalledWith`).

## How to Run Tests

To execute the full test suite:

```bash
# Run all tests once
npm test run

# Run functionality specific tests (e.g. only Login)
npm test run Login
```

## Setup Configuration

-   **`vite.config.js`**: Configures the test environment to `jsdom` and includes setup files.
-   **`src/tests/setup.js`**: Imports `@testing-library/jest-dom` to extend Vitest with helpful DOM assertions like `toBeInTheDocument` and `toHaveValue`.
