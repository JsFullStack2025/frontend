import { useState, useCallback } from 'react';
import QRCode from 'qrcode';
import { toast } from 'sonner';

interface UseCardQrProps {
  cardId: string;
  // Base URL or path pattern for QR code redirection can be configured here in the future
  // getQrUrlPattern?: (cardId: string) => string; 
}

export function useCardQr({ cardId }: UseCardQrProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [isGeneratingQr, setIsGeneratingQr] = useState<boolean>(false);
  const [qrError, setQrError] = useState<string | null>(null);

  const generateQrCode = useCallback(async () => {
    if (!cardId) {
      toast.error("ID карточки не определен.");
      return;
    }
    setIsGeneratingQr(true);
    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const effectiveBaseUrl = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');

      if (!effectiveBaseUrl && typeof window !== 'undefined') {
        console.error("Base URL is not defined for QR code generation.");
        toast.error("Не удалось сгенерировать QR-код: URL не определен.");
        setIsGeneratingQr(false);
        return;
      }
      const cardViewUrl = `${effectiveBaseUrl}/cards/${cardId}/view/qr`;
      
      const dataUrl = await QRCode.toDataURL(cardViewUrl, {
        width: 300,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: {
          dark: "#000000",
        },
      });
      setQrCodeDataUrl(dataUrl);
      setQrError(null);
      setShowQrModal(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Неизвестная ошибка";
      console.error("QR code generation error:", message);
      toast.error(`Ошибка генерации QR-кода: ${message}`);
      setQrError(message);
      setQrCodeDataUrl(null);
    } finally {
      setIsGeneratingQr(false);
    }
  }, [cardId]);

  const downloadQrCode = useCallback(() => {
    if (!qrCodeDataUrl || !cardId) return;
    
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `qr-card-${cardId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR-код загружен.');
  }, [qrCodeDataUrl, cardId]);

  const openQrModal = useCallback(() => {
    if (qrCodeDataUrl && !isGeneratingQr) { 
      setShowQrModal(true);
    } else if (!isGeneratingQr) { 
      generateQrCode();
    }
  }, [qrCodeDataUrl, isGeneratingQr, generateQrCode]);

  const closeQrModal = useCallback(() => {
    setShowQrModal(false);
  }, []);

  return {
    qrCodeDataUrl,
    showQrModal,
    isGeneratingQr,
    qrError,
    generateQrCode,
    downloadQrCode,
    openQrModal,
    closeQrModal,
  };
} 