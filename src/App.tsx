import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [options, setOptions] = useState({
    'tipo-levantamento': 'estatico',
    'modelo-antena': 'Nao alterar RINEX',
    email: '',
  });
  const [results, setResults] = useState<any[]>([]);
  const [downloadReport, setDownloadReport] = useState<{ success: string[]; fail: string[] }>({ success: [], fail: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoDownload, setAutoDownload] = useState(false);
  const downloadLinksRef = useRef<HTMLAnchorElement[]>([]);

  useEffect(() => {
    if (autoDownload && results.length > 0) {
      const success: string[] = [];
      const fail: string[] = [];
      results.forEach((r) => {
        if (r.link) {
          const a = document.createElement('a');
          a.href = r.link;
          a.download = r.original;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          success.push(r.original);
        } else {
          fail.push(r.original);
        }
      });
      setDownloadReport({ success, fail });
    }
    // eslint-disable-next-line
  }, [results, autoDownload]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setOptions({ ...options, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResults([]);
    setDownloadReport({ success: [], fail: [] });
    if (!files || files.length === 0) {
      setError('Selecione pelo menos um arquivo.');
      return;
    }
    setLoading(true);
    const newResults: any[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('arquivo', file);
      Object.entries(options).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('autorizacao-uso', 'true');
      try {
        const res = await fetch('https://servicodados.ibge.gov.br/api/v1/ppp', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.link) {
          newResults.push({ original: file.name, link: data.link });
        } else {
          newResults.push({ original: file.name, link: null });
        }
      } catch (err) {
        newResults.push({ original: file.name, link: null });
      }
    }
    setResults(newResults);
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Processamento GNSS IBGE PPP</h1>
      <form onSubmit={handleSubmit} className="form-ppp">
        <div className="form-group">
          <label>Arquivos GNSS:</label>
          <input type="file" multiple onChange={handleFileChange} accept=".zip,.gz,.rnx,.obs,.??o" />
        </div>
        <div className="form-group">
          <label>Tipo de Levantamento:</label>
          <select name="tipo-levantamento" value={options['tipo-levantamento']} onChange={handleOptionChange}>
            <option value="estatico">Estático</option>
            <option value="cinematico">Cinético</option>
          </select>
        </div>
        <div className="form-group">
          <label>Modelo da Antena:</label>
          <input name="modelo-antena" value={options['modelo-antena']} onChange={handleOptionChange} />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input name="email" value={options.email} onChange={handleOptionChange} type="email" />
        </div>
        <div className="form-group form-checkbox">
          <input type="checkbox" id="autoDownload" checked={autoDownload} onChange={e => setAutoDownload(e.target.checked)} />
          <label htmlFor="autoDownload">Baixar automaticamente após processar</label>
        </div>
        <button type="submit" className="btn-enviar" disabled={loading}>{loading ? 'Processando...' : 'Enviar'}</button>
      </form>
      {error && <div className="error-msg">{error}</div>}
      {results.length > 0 && (
        <div className="resultados">
          <h2>Resultados:</h2>
          <ul>
            {results.map((r, i) => (
              <li key={i} className="resultado-item">
                {r.original}: {r.link ? (
                  <a href={r.link} target="_blank" rel="noopener noreferrer">
                    Baixar resultado
                  </a>
                ) : (
                  <span style={{color: 'red'}}>Erro ao obter link</span>
                )}
              </li>
            ))}
          </ul>
          {(downloadReport.success.length > 0 || downloadReport.fail.length > 0) && (
            <div className="download-report">
              <h3>Relatório de Download</h3>
              {downloadReport.success.length > 0 && (
                <div>
                  <strong>Baixados com sucesso:</strong>
                  <ul>
                    {downloadReport.success.map((name, idx) => (
                      <li key={idx} style={{ color: '#4caf50' }}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}
              {downloadReport.fail.length > 0 && (
                <div>
                  <strong>Falha ao baixar:</strong>
                  <ul>
                    {downloadReport.fail.map((name, idx) => (
                      <li key={idx} style={{ color: '#d32f2f' }}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
