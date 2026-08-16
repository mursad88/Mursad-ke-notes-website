import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // हम चेक कर रहे हैं कि क्या ब्राउज़र के पास लॉगिन का पास (isLoggedIn) है?
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (!isLoggedIn) {
    // अगर पास नहीं है, तो उसे सीधा वापस '/login' पेज पर भगा दो
    return <Navigate to="/login" replace />;
  }

  // अगर पास है, तो उसे अंदर (पेज पर) जाने दो
  return children;
}

export default ProtectedRoute;