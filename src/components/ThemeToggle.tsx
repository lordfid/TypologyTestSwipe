type ThemeToggleProps = {
  theme: 'light' | 'dark';
  onToggle: () => void;
};

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button className="ghost-button" onClick={onToggle} aria-label="Ganti mode warna">
      {theme === 'dark' ? 'Mode terang' : 'Mode gelap'}
    </button>
  );
}
