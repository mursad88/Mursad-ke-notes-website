import { useState } from 'react';
import { useParams } from 'react-router-dom';

function ViewNote() {
  const { id } = useParams();
  
  // ये हमारी स्टेट (State) हैं जो पासवर्ड और लॉक को संभालेंगी
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');

  // अभी के लिए हमने '123' को पासवर्ड रखा है। 
  // (बाद में जब हम बैकएंड बनाएंगे, तो हर छात्र का पासवर्ड अलग होगा जो डेटाबेस से आएगा)
  const correctPassword = "123"; 

  // जब यूज़र 'अनलॉक करें' बटन दबाएगा, तब यह फंक्शन चलेगा
  const handleUnlock = (e) => {
    e.preventDefault(); // इससे पेज रिफ्रेश नहीं होगा
    
    if (password === correctPassword) {
      setIsUnlocked(true);
      setError('');
    } else {
      setError('गलत पासवर्ड! कृपया दोबारा प्रयास करें।');
    }
  };

  // राइट-क्लिक बंद करने का फंक्शन
  const disableRightClick = (e) => {
    e.preventDefault();
  };

  // --------------------------------------------------------
  // स्क्रीन 1: अगर लॉक नहीं खुला है, तो पासवर्ड वाली स्क्रीन दिखाएं
  // --------------------------------------------------------
  if (!isUnlocked) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border-t-4 border-blue-800">
          <div className="text-center mb-8">
            <span className="text-6xl block mb-4">🔒</span>
            <h2 className="text-3xl font-extrabold text-gray-800">पीडीएफ सुरक्षित है</h2>
            <p className="text-gray-600 mt-2">इसे खोलने के लिए कृपया अपना पासवर्ड दर्ज करें।</p>
          </div>
          
          <form onSubmit={handleUnlock}>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="पासवर्ड डालें (हिंट: 123)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 mb-2"
            />
            
            {/* अगर पासवर्ड गलत है, तो यहाँ लाल रंग में एरर दिखेगा */}
            {error && <p className="text-red-500 text-sm mb-4 font-bold">{error}</p>}
            
            <button 
              type="submit" 
              className="w-full bg-blue-800 text-white py-3 rounded-lg font-bold hover:bg-blue-900 transition mt-4 shadow-md"
            >
              अनलॉक करें
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // स्क्रीन 2: अगर सही पासवर्ड डाल दिया, तो सुरक्षित पीडीएफ दिखाएं
  // --------------------------------------------------------
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 w-full max-w-5xl rounded shadow-sm flex justify-between items-center">
        <p className="font-bold">सुरक्षा अलर्ट:</p>
        <p>इस नोट्स को पढ़ने के लिए आपके पास <span className="font-extrabold text-red-600">23 घंटे 59 मिनट</span> बचे हैं।</p>
      </div>

      <div 
        className="bg-gray-900 w-full max-w-5xl h-[80vh] rounded-xl shadow-2xl flex flex-col items-center justify-center text-white relative border-4 border-gray-800"
        onContextMenu={disableRightClick}
      >
        <div className="text-center p-8">
          <span className="text-6xl mb-4 block text-green-400">✅</span>
          <h2 className="text-2xl font-bold mb-2">आपका पीडीएफ यहाँ सफलतापूर्वक खुल गया है!</h2>
          <p className="text-gray-400">(यह एक डेमो है, बाद में हम यहाँ असली पीडीएफ व्यूअर लगायेंगे)</p>
        </div>
        
        <div className="absolute inset-0 z-10"></div>
      </div>

    </div>
  );
}

export default ViewNote;