import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

function Notes() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");

  const [noteData, setNoteData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNote = async () => {
      if (!reference) {
        setError("एक्सेस मना है! कृपया पहले नोट्स खरीदें।");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/payment/get-note-content/${reference}`);
        const data = await response.json();

        if (data.success) {
          // यहाँ हम pdfFile को भी स्टेट में सेव कर रहे हैं
          setNoteData({ title: data.title, content: data.content, pdfFile: data.pdfFile });

          const purchaseDate = new Date(data.purchaseDate).getTime();
          const expireDate = purchaseDate + (24 * 60 * 60 * 1000); 
          const now = new Date().getTime();
          const remainingSeconds = Math.floor((expireDate - now) / 1000);

          if (remainingSeconds > 0) {
            setTimeLeft(remainingSeconds);
          } else {
            setError("आपके नोट्स देखने का 24 घंटे का समय खत्म हो चुका है।");
          }
        } else {
          setError(data.message || "नोट्स लोड करने में समस्या आई।");
        }
      } catch (err) {
        setError("सर्वर से जुड़ने में समस्या आ रही है।");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [reference]);

  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleCopy = (e) => {
      e.preventDefault();
      alert("⚠️ सुरक्षा चेतावनी: इन नोट्स को कॉपी या डाउनलोड करना सख्त मना है!");
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      clearInterval(timer);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-blue-900 animate-pulse">असली नोट्स लोड हो रहे हैं... ⏳</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">🚫 एक्सेस ब्लॉक कर दिया गया</h1>
        <p className="text-gray-700 mb-6 text-lg">{error}</p>
        <Link to="/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:bg-blue-700 transition">
          डैशबोर्ड पर वापस जाएँ
        </Link>
      </div>
    );
  }

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8 select-none">
      
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-md mb-8 border-l-8 border-blue-600 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">प्रीमियम सुरक्षित नोट्स</h2>
          <p className="text-sm text-green-600 font-semibold mt-1 font-mono">रसीद: {reference}</p>
        </div>
        <div className="bg-red-100 text-red-700 px-6 py-3 rounded-lg flex flex-col items-center shadow-inner min-w-[200px]">
          <span className="text-xs font-bold uppercase tracking-wider mb-1">बचा हुआ एक्सेस समय</span>
          <span className="text-2xl font-black font-mono">
            {hours}h : {minutes < 10 ? '0'+minutes : minutes}m : {seconds < 10 ? '0'+seconds : seconds}s
          </span>
        </div>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-6 border-b pb-4">
          {noteData.title}
        </h1>
        
        {/* अगर सिर्फ टेक्स्ट है, तो वह यहाँ दिखेगा */}
        {noteData.content && (
          <div 
            className="text-gray-800 leading-relaxed space-y-4 text-lg mb-8"
            dangerouslySetInnerHTML={{ __html: noteData.content }}
          ></div>
        )}

        {/* अगर PDF फाइल है, तो वह यहाँ एक फ्रेम में खुलेगी */}
        {noteData.pdfFile && (
          <div className="mt-6 border-4 border-gray-200 rounded-xl overflow-hidden h-[80vh] shadow-inner bg-gray-100 flex flex-col">
            <div className="bg-gray-200 p-2 text-center text-sm font-bold text-gray-600 border-b">
              PDF व्यूअर - डाउनलोड करना मना है
            </div>
            <iframe
              src={`http://localhost:5000/${noteData.pdfFile}#toolbar=0`} 
              className="w-full h-full"
              title="PDF Notes"
            ></iframe>
          </div>
        )}
        
        <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500 mt-12 shadow-sm">
          <h3 className="font-bold text-xl text-yellow-800 mb-2">सिस्टम सुरक्षा नियम:</h3>
          <ul className="list-disc list-inside space-y-2 text-yellow-900">
            <li>यह पेज डेटाबेस के समय के अनुसार ठीक 24 घंटे बाद ब्लॉक हो जाएगा।</li>
            <li>आप पेज रिफ्रेश कर सकते हैं, टाइमर जहाँ से रुका था वहीं से चलेगा।</li>
            <li>कीबोर्ड या माउस से कंटेंट कॉपी करने की सभी कोशिशें रिकॉर्ड की जा रही हैं।</li>
          </ul>
        </div>
      </div>
      
    </div>
  );
}

export default Notes;