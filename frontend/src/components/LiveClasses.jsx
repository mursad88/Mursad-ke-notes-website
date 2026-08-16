function LiveClasses() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-4xl font-extrabold text-blue-900 mb-4">Live Classes</h1>
      <p className="text-xl text-gray-600 mb-8">यहाँ बहुत जल्द आपकी ऑनलाइन लाइव क्लासेज़ शुरू होंगी!</p>
      
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 max-w-2xl w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">अपकमिंग क्लास शेड्यूल</h2>
        <p className="text-gray-600">अगले बैच की जानकारी जल्द ही यहाँ अपडेट की जाएगी। जुड़े रहें!</p>
      </div>
    </div>
  );
}

export default LiveClasses;