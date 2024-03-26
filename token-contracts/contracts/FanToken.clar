
;; title: FanToken
;; version:
;; summary:
;; description:

;; traits
(define-trait sip-010-trait
  (
    (transfer (uint principal principal (optional (buff 34))) (response bool uint))
    (get-name () (response (string-ascii 32) uint))
    (get-symbol () (response (string-ascii 32) uint))
    (get-decimals () (response uint uint))
    (get-balance (principal) (response uint uint))
    (get-total-supply () (response uint uint))
    (get-token-uri () (response (optional (string-utf8 256)) uint))
  )
)

;; token definitions //ten thousand total tokens;
(define-fungible-token fanToken u1000000000000) ;;one million tokens total supply

;; constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-amount-less-than-zero (err u102))

;; public functions
;;#[allow(unchecked_data)]
(define-public (mint (amount uint) (recipient principal))
    (begin
        (asserts! (> amount u0) err-amount-less-than-zero)
        (ft-mint? fanToken amount recipient)
    )
)

;;#[allow(unchecked_data)]
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
    (begin
        (asserts! (> amount u0) err-amount-less-than-zero)
        (asserts! (is-eq tx-sender sender) err-not-token-owner)
        (try! (ft-transfer? fanToken amount sender recipient))
        (match memo to-print (print to-print) 0x)
        (ok true)
    )
)
;; read only functions
(define-read-only (get-balance (owner principal))
    (ok (ft-get-balance fanToken owner))
)

(define-read-only (get-total-supply)
    (ok (ft-get-supply fanToken))
)

(define-read-only (get-token-uri)
    (ok none)
)

(define-read-only (get-name)
    (ok "FanToken")
)

(define-read-only (get-symbol)
    (ok "FT")
)

(define-read-only (get-decimals)
    (ok u6)
)
