type StartScreenProps = {
  total: number;
  hasProgress: boolean;
  onStart: () => void;
  onContinue: () => void;
  onReset: () => void;
};

export function StartScreen({ total, hasProgress, onStart, onContinue, onReset }: StartScreenProps) {
  return (
    <section className="start-screen card fade-in">
      <div className="eyebrow">Tes Kepribadian Mendalam</div>
      <h1>Tes Kepribadian Mendalam</h1>
      <p className="lead">
        Kau akan memilih di antara dua adegan kecil. Tidak ada jawaban yang harus terlihat indah.
        Pilih yang paling dekat dengan gerak, ucapan, atau benda yang akan kau ambil.
      </p>
      <div className="start-grid">
        <div>
          <strong>{total} pasangan situasi</strong>
          <span>Jawaban bisa kiri, kanan, dua-duanya, tidak dua-duanya, tergantung, atau lewati.</span>
        </div>
        <div>
          <strong>Bukan diagnosis klinis</strong>
          <span>Hasil dibaca sebagai kemungkinan dan kecenderungan tipologi.</span>
        </div>
        <div>
          <strong>Tersimpan sementara</strong>
          <span>Kalau tertutup, progresmu masih disimpan di perangkat ini.</span>
        </div>
      </div>
      <div className="button-row">
        {hasProgress ? <button className="primary-button" onClick={onContinue}>Lanjutkan</button> : null}
        <button className="primary-button" onClick={onStart}>{hasProgress ? 'Mulai ulang dari awal' : 'Mulai tes'}</button>
        {hasProgress ? <button className="ghost-button danger" onClick={onReset}>Hapus progres</button> : null}
      </div>
      <p className="keyboard-hint">Keyboard: A kiri, D kanan, W dua-duanya, S tidak dua-duanya, T tergantung, L lewati.</p>
    </section>
  );
}
