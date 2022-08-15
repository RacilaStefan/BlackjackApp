# BlackjackApp

Inca nu am adaugat sunete, cred ca o sa dureze cateva ore.
Nu exista explicit un mod 1v1, pot intra pana la 5 playeri simultan intr-un joc cu un dealer. Dealer-ul este tot un player asignat jocului in sine, si acesta joaca ultimul si incheie jocul.

Buguri cunoscute:

* Clientul web nu este sincronizat intre instante, adica intr-o pagina poate aparea in joc, dar in restul nu.
* Un client care nu face request-uri http este deconectat de catre Heroku. S-a incercat un sistem de ping-pong prin protocolul ws, dar se pare ca mesajele prin ws nu reseteaza timer-ul ala.
* Daca un client pierde conexiune sau pleaca dintr-un joc, efectul nu este propagat si participantilor.

Ce trebuie adaugat:

* Incercarea de conectare la un joc care nu exista trimite la o pagina goala, server-ul trimite datele corect, clientul doar trebuie sa le mai interpreteze, am facut mai pe direct ca sa termin mai rpd jocul.
* Notificarile nu au un timer cand sa expire si mai trebuie lucrat la layout.
* Trebuie adaugat sunete.
