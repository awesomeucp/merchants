'use client';

import { useState, useRef } from 'react';
import { ShoppingBag, Truck, Image, Check, Receipt, Percent, Key, CreditCard, TestTube, XLogo, LinkedinLogo, SealCheck } from '@phosphor-icons/react';
import type { UCPDiscoveryProfile } from '@/lib/types/ucp-profile';
import { domToBlob } from 'modern-screenshot';

interface UCPCardProps {
  domain: string;
  profile: UCPDiscoveryProfile;
}

const CAPABILITY_CONFIG: Record<string, { icon: React.ReactNode; label: string }> = {
  'checkout': { icon: <ShoppingBag size={14} weight="bold" />, label: 'Checkout' },
  'fulfillment': { icon: <Truck size={14} weight="bold" />, label: 'Fulfillment' },
  'order': { icon: <Receipt size={14} weight="bold" />, label: 'Order' },
  'discount': { icon: <Percent size={14} weight="bold" />, label: 'Discount' },
  'ap2_mandate': { icon: <Key size={14} weight="bold" />, label: 'AP2 Mandate' },
};

function formatCapabilityName(name: string): string {
  const capName = name.split('.').pop() || name;
  return CAPABILITY_CONFIG[capName]?.label ||
    capName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function formatMerchantName(name: string): string {
  // If it looks like a domain, extract the main part
  if (name.includes('.')) {
    const parts = name.replace(/^www\./, '').split('.');
    if (parts.length >= 2) {
      return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    }
  }
  return name;
}

const PAYMENT_CONFIG: Record<string, { icon: React.ReactNode; color: string; name: string }> = {
  'com.google.pay': { icon: <span style={{ color: '#1a73e8', fontWeight: 900 }}>G</span>, color: '#1a73e8', name: 'Google Pay' },
  'com.apple.pay': { icon: <span style={{ color: '#000000', fontWeight: 900 }}></span>, color: '#000000', name: 'Apple Pay' },
  'com.paypal': { icon: <span style={{ color: '#003087', fontWeight: 900 }}>P</span>, color: '#003087', name: 'PayPal' },
  'dev.ucp.payment.mock': { icon: <TestTube size={16} weight="bold" style={{ color: '#d97706' }} />, color: '#d97706', name: 'Mock Payment' },
  'dev.ucp.payment.card': { icon: <CreditCard size={16} weight="bold" style={{ color: '#059669' }} />, color: '#059669', name: 'Card Payment' },
};

export function UCPCard({ domain, profile }: UCPCardProps) {
  const [copied, setCopied] = useState(false);
  const [copying, setCopying] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const rawMerchantName = profile.payment?.handlers?.[0]?.config?.merchant_info?.merchant_name ||
                          profile.payment?.handlers?.[0]?.config?.merchant_id ||
                          domain;
  const merchantName = formatMerchantName(rawMerchantName);
  const capabilities = profile.ucp.capabilities;
  const paymentHandlers = profile.payment?.handlers || [];
  const cardNetworks = paymentHandlers[0]?.config?.allowed_payment_methods?.[0]?.parameters?.allowed_card_networks ||
                       paymentHandlers.find(h => h.supported_networks)?.supported_networks?.map((n: string) => n.toUpperCase()) ||
                       [];
  const version = profile.ucp.version;

  const shareText = `${merchantName} is UCP-enabled! Check out their Universal Commerce Protocol profile.`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://ucp.dev/cards/${domain}`;

  const copyAsImage = async () => {
    if (!cardRef.current) return;
    setCopying(true);
    try {
      const blob = await domToBlob(cardRef.current, {
        backgroundColor: '#F8F5F2',
        scale: 2,
      });
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.error('Failed to copy image:', err);
    } finally {
      setCopying(false);
    }
  };

  const copyImageToClipboard = async () => {
    if (!cardRef.current) return;
    try {
      const blob = await domToBlob(cardRef.current, {
        backgroundColor: '#F8F5F2',
        scale: 2,
      });
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
      }
    } catch (err) {
      console.error('Failed to copy image:', err);
    }
  };

  const shareToX = async () => {
    await copyImageToClipboard();
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareToLinkedIn = async () => {
    await copyImageToClipboard();
    const url = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Main Card */}
      <div
        ref={cardRef}
        className="rounded-3xl sm:rounded-[44px] p-5 sm:p-8 hover:-translate-y-3 transition-all duration-500"
        style={{
          backgroundColor: 'rgba(255,255,255,0.9)',
          border: '1px solid rgba(255,255,255,0.9)',
          boxShadow: '0 40px 100px -30px rgba(60,71,58,0.1)',
        }}
      >

        {/* Header */}
        <div className="flex justify-between items-start gap-4 mb-6">
          <div className="min-w-0 flex-1">
            {/* Node Active Badge */}
            <div
              className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4"
              style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#047857' }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#10b981' }}></span>
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: '#10b981' }}></span>
              </span>
              Active
            </div>

            {/* Merchant Name */}
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight" style={{ color: '#3C473A' }}>
              {merchantName}
            </h2>
            <p className="text-xs font-medium mt-1.5 truncate" style={{ color: '#A8B89F' }}>{domain}</p>
          </div>

          {/* Version Badge */}
          <div className="px-3 py-2 rounded-xl text-center shrink-0" style={{ backgroundColor: 'rgba(60,71,58,0.08)' }}>
            <p className="font-mono text-xs font-semibold" style={{ color: '#3C473A' }}>{version}</p>
          </div>
        </div>

        {/* Capabilities */}
        <div className="mb-6">
          <h3 className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: '#A8B89F' }}>
            Capabilities
          </h3>
          <div className="flex flex-wrap gap-2">
            {capabilities.map((cap) => {
              const capName = cap.name.split('.').pop() || cap.name;
              const config = CAPABILITY_CONFIG[capName];
              return (
                <div
                  key={cap.name}
                  className="flex items-center gap-2 text-white px-3.5 py-2 rounded-full text-xs font-medium"
                  style={{ backgroundColor: '#3C473A' }}
                >
                  {config?.icon || <ShoppingBag size={14} weight="bold" />}
                  <span>{formatCapabilityName(cap.name)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Protocol Line */}
        <div className="h-px my-6" style={{ background: 'linear-gradient(90deg, transparent, rgba(168,184,159,0.3), transparent)' }} />

        {/* Payment Handlers */}
        {paymentHandlers.length > 0 && (
          <div className="mb-6">
            <h3 className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: '#A8B89F' }}>
              Payments
            </h3>
            <div className="space-y-2">
              {paymentHandlers.map((handler) => {
                const config = PAYMENT_CONFIG[handler.name] || {
                  icon: <CreditCard size={16} weight="bold" />,
                  color: '#666666',
                  name: handler.name.split('.').pop()?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || handler.name
                };
                return (
                  <div
                    key={handler.id}
                    className="flex items-center gap-3 p-3 rounded-2xl"
                    style={{ backgroundColor: 'rgba(255,255,255,0.8)', border: '1px solid rgba(168,184,159,0.2)' }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: '#ffffff', border: '1px solid #e5e5e5', color: typeof config.color === 'string' && config.color.startsWith('text-') ? undefined : config.color }}
                    >
                      {config.icon}
                    </div>
                    <span className="text-sm font-semibold" style={{ color: '#3C473A' }}>{config.name}</span>
                  </div>
                );
              })}
            </div>

            {/* Card Networks */}
            {cardNetworks.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {cardNetworks.map((network) => (
                  <span
                    key={network}
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-lg"
                    style={{ backgroundColor: 'rgba(168,184,159,0.15)', color: '#3C473A' }}
                  >
                    {network === 'MASTERCARD' ? 'Mastercard' : network.charAt(0) + network.slice(1).toLowerCase()}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* UCP Compliance Badge */}
        <div
          className="flex items-center justify-center gap-2 py-4 mb-4"
          style={{ borderTop: '1px solid rgba(168,184,159,0.2)', borderBottom: '1px solid rgba(168,184,159,0.2)' }}
        >
          <SealCheck size={20} weight="fill" style={{ color: '#059669' }} />
          <span className="text-sm font-semibold" style={{ color: '#3C473A' }}>UCP Compliant</span>
        </div>

        {/* Share Buttons */}
        <div className="flex gap-2">
          <button
            onClick={copyAsImage}
            disabled={copying}
            className="flex-1 text-white py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
            style={{ backgroundColor: '#3C473A' }}
          >
            {copied ? (
              <>
                <Check size={18} weight="bold" />
                Copied!
              </>
            ) : (
              <>
                <Image size={18} weight="bold" />
                {copying ? 'Copying...' : 'Copy Image'}
              </>
            )}
          </button>
          <button
            onClick={shareToX}
            className="w-14 text-white py-3.5 rounded-2xl font-semibold flex items-center justify-center transition-all duration-200 active:scale-[0.98]"
            style={{ backgroundColor: '#000000' }}
            title="Share on X"
          >
            <XLogo size={20} weight="bold" />
          </button>
          <button
            onClick={shareToLinkedIn}
            className="w-14 text-white py-3.5 rounded-2xl font-semibold flex items-center justify-center transition-all duration-200 active:scale-[0.98]"
            style={{ backgroundColor: '#0A66C2' }}
            title="Share on LinkedIn"
          >
            <LinkedinLogo size={20} weight="bold" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-5 text-center text-[11px]" style={{ color: 'rgba(168,184,159,0.8)' }}>
        Powered by <span className="font-semibold" style={{ color: 'rgba(60,71,58,0.6)' }}>UCP</span>
      </p>
    </div>
  );
}
