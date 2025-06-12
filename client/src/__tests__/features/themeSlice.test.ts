import themeReducer, { toggleTheme, setTheme } from '../../features/theme/themeSlice';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Theme Slice', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test('should return the initial state', () => {
    // Since getInitialTheme depends on localStorage and window.matchMedia,
    // we're testing the reducer with an explicitly provided state
    const initialState = { mode: 'light' };
    expect(themeReducer(initialState, { type: undefined })).toEqual(initialState);
  });

  test('should handle toggleTheme action', () => {
    // Start with light theme
    const initialState = { mode: 'light' };
    
    // Toggle to dark
    const darkState = themeReducer(initialState, toggleTheme());
    expect(darkState).toEqual({ mode: 'dark' });
    expect(localStorage.getItem('theme')).toBe('dark');
    
    // Toggle back to light
    const lightState = themeReducer(darkState, toggleTheme());
    expect(lightState).toEqual({ mode: 'light' });
    expect(localStorage.getItem('theme')).toBe('light');
  });

  test('should handle setTheme action', () => {
    // Start with light theme
    const initialState = { mode: 'light' };
    
    // Set to dark explicitly
    const darkState = themeReducer(initialState, setTheme('dark'));
    expect(darkState).toEqual({ mode: 'dark' });
    expect(localStorage.getItem('theme')).toBe('dark');
    
    // Set to light explicitly
    const lightState = themeReducer(darkState, setTheme('light'));
    expect(lightState).toEqual({ mode: 'light' });
    expect(localStorage.getItem('theme')).toBe('light');
  });

  test('should persist theme in localStorage', () => {
    // Start with no theme in localStorage
    expect(localStorage.getItem('theme')).toBeNull();
    
    // Set theme to dark
    themeReducer({ mode: 'light' }, setTheme('dark'));
    expect(localStorage.getItem('theme')).toBe('dark');
    
    // Toggle theme
    themeReducer({ mode: 'dark' }, toggleTheme());
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
