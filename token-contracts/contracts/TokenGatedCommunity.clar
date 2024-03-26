
;; title: TokenGatedCommunity
;; version: 1.0
;; summary: 
;; description:


;; constants
(define-constant contract-owner tx-sender)
(define-constant err-insufficient-token-balance (err u1002))
(define-constant err-getting-balance (err u1003))
(define-constant err-not-the-owner (err u1004))
(define-constant err-token-not-greaterThan-Zero (err u1005))
(define-constant err-unwrap-failed (err u1006))
(define-constant err-already-a-member (err u1007))
(define-constant err-not-a-member (err u1008))

(define-map tokenBalances principal uint)

;; data vars
(define-data-var entryTokenAmount uint u50000000) ;;50 FT


(define-public (joinCommunity) 
  (begin
    (if (is-none (userTokenBalance tx-sender))
     (transferTokenAndJoinCommunity (var-get entryTokenAmount))
      err-already-a-member
    )
  )
)

 (define-private (transferTokenAndJoinCommunity (tokenAmount uint)) 
   (begin 
    (try! (contract-call? .FanToken transfer tokenAmount tx-sender (as-contract tx-sender) none))
    (map-set tokenBalances tx-sender tokenAmount)
    (ok true)
   )
 )

 (define-public (removeTokenAndExitCommunity)

     (
        let (
            (balance (unwrap! (userTokenBalance tx-sender) err-not-a-member))
        )

        (try! (payoutTokens tx-sender balance))
        (map-delete tokenBalances tx-sender)
        (ok true)
     )
 )

 
    (define-private (payoutTokens (receiver principal) (amount uint))
     (begin 
        (asserts! (is-eq .TokenGatedCommunity (as-contract tx-sender)) err-not-the-owner )
        (try! (as-contract (contract-call? .FanToken transfer amount .TokenGatedCommunity receiver  none)))
        (ok true)
      )
  )

(define-read-only (userTokenBalance (user principal)) 
   (map-get? tokenBalances user)
)

(define-read-only (isUserACommunityMember (user principal)) 
   (match (map-get? tokenBalances user) bal
     (begin 
       bal
      (ok true)
     )
     (ok false)
   )
)


;;read-only function
(define-read-only (getEntryTokenAmount)
 (ok (var-get entryTokenAmount))
)


;;public-function
(define-public (setEntryTokenAmount (newEntryTokenAmount uint) ) 

(begin
    (asserts! (is-eq tx-sender contract-owner) err-not-the-owner)
    (asserts! (> newEntryTokenAmount u0) err-token-not-greaterThan-Zero)
    (var-set entryTokenAmount newEntryTokenAmount)
    (ok true)
)
)



