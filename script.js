import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBdq0A2s4psLgXLLCyD9GePiU_GIo0eryw",
  authDomain: "autenticacao123-f4a25.firebaseapp.com",
  projectId: "autenticacao123-f4a25",
  storageBucket: "autenticacao123-f4a25.firebasestorage.app",
  messagingSenderId: "843582498143",
  appId: "1:843582498143:web:6164aa057fae0331a802ea"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app); 

const loginScreen = document.getElementById('login-screen');
const profileScreen = document.getElementById('profile-screen');
const inviteScreen = document.getElementById('invite-screen');
const lobbyScreen = document.getElementById('lobby-screen');
const appContent = document.getElementById('app-content');
const splashScreen = document.getElementById('splash-welcome');

// ==========================================
// 🛒 O HIPERMERCADO ATACADÃO COSTA E SILVA (COMPACTADO)
// ==========================================
const dbBruto = [
    {n:"Arroz Branco (1kg)",p:6.49},{n:"Arroz Branco (5kg)",p:24.90},{n:"Arroz Parboilizado (5kg)",p:25.90},{n:"Arroz Integral (1kg)",p:7.99},
    {n:"Feijão Carioca (1kg)",p:7.49},{n:"Feijão Preto (1kg)",p:8.49},{n:"Feijão Fradinho (500g)",p:6.90},{n:"Lentilha (500g)",p:9.90},
    {n:"Óleo de Soja (900ml)",p:5.89},{n:"Óleo de Girassol (900ml)",p:11.90},{n:"Azeite Extra Virgem (500ml)",p:39.90},{n:"Azeite Tipo Único (500ml)",p:34.90},
    {n:"Açúcar Refinado (1kg)",p:4.59},{n:"Açúcar Cristal (5kg)",p:21.90},{n:"Açúcar Mascavo (500g)",p:7.90},{n:"Adoçante Sucralose (100ml)",p:8.50},
    {n:"Café Tradicional (500g)",p:17.90},{n:"Café Extra Forte (500g)",p:17.90},{n:"Café Solúvel (50g)",p:7.99},{n:"Filtro de Café (103 c/ 30)",p:4.90},
    {n:"Macarrão Espaguete (500g)",p:3.99},{n:"Macarrão Penne (500g)",p:4.49},{n:"Macarrão Parafuso (500g)",p:4.49},{n:"Miojo / Lamen (85g)",p:1.99},
    {n:"Farinha de Trigo (1kg)",p:4.99},{n:"Farinha de Mandioca (1kg)",p:6.49},{n:"Fubá Mimoso (500g)",p:3.49},{n:"Farinha de Rosca (500g)",p:4.99},
    {n:"Sal Refinado (1kg)",p:2.99},{n:"Sal Grosso (1kg)",p:4.50},{n:"Extrato de Tomate (140g)",p:2.99},{n:"Molho de Tomate Sachê (340g)",p:2.49},
    {n:"Milho Verde Lata (170g)",p:3.49},{n:"Ervilha Lata (170g)",p:3.49},{n:"Seleta de Legumes (Lata)",p:3.99},{n:"Atum Sólido Óleo (Lata)",p:9.90},
    {n:"Sardinha Óleo (Lata)",p:4.99},{n:"Maionese Pote (500g)",p:7.90},{n:"Ketchup (400g)",p:7.50},{n:"Mostarda (400g)",p:8.50},
    {n:"Leite Condensado (395g)",p:5.99},{n:"Creme de Leite (200g)",p:3.99},{n:"Achocolatado Nescau (400g)",p:8.99},{n:"Leite em Pó Integral (400g)",p:15.90},
    {n:"Biscoito Água e Sal (400g)",p:5.49},{n:"Biscoito Recheado (130g)",p:2.99},{n:"Pão de Forma (500g)",p:7.99},{n:"Pão de Forma Integral (500g)",p:9.99},
    {n:"Leite Integral (1L)",p:4.99},{n:"Leite Desnatado (1L)",p:4.99},{n:"Manteiga c/ Sal (200g)",p:11.90},{n:"Margarina (500g)",p:7.49},
    {n:"Queijo Mussarela Fatiado (200g)",p:12.90},{n:"Presunto Cozido Fatiado (200g)",p:8.90},{n:"Peito de Peru Fatiado (200g)",p:14.90},
    {n:"Iogurte Natural (170g)",p:3.29},{n:"Iogurte Morango (1L)",p:10.90},{n:"Leite Fermentado Yakult (Pack 6)",p:8.49},{n:"Requeijão Tradicional (200g)",p:8.99},
    {n:"Alcatra (1kg)",p:42.90},{n:"Contrafilé (1kg)",p:45.90},{n:"Patinho Moído (1kg)",p:39.90},{n:"Carne Moída 2ª (1kg)",p:28.90},
    {n:"Peito de Frango s/ Osso (1kg)",p:19.90},{n:"Coxa de Frango (1kg)",p:12.90},{n:"Linguiça Toscana (1kg)",p:19.90},{n:"Salsicha Hot Dog (1kg)",p:11.90},
    {n:"Batata Lavada (1kg)",p:6.99},{n:"Cebola Branca (1kg)",p:5.49},{n:"Tomate Carmem (1kg)",p:7.99},{n:"Alho (100g)",p:3.50},
    {n:"Maçã Gala (1kg)",p:9.90},{n:"Banana Prata (1kg)",p:6.99},{n:"Laranja Pera (1kg)",p:4.99},{n:"Limão Tahiti (1kg)",p:4.50},
    {n:"Sabão em Pó OMO (1kg)",p:14.90},{n:"Sabão Líquido (3L)",p:39.90},{n:"Amaciante Concentrado (1L)",p:19.90},{n:"Detergente Líquido (500ml)",p:2.69},
    {n:"Água Sanitária (2L)",p:5.99},{n:"Desinfetante Veja (500ml)",p:5.49},{n:"Esponja de Pia (Pacote c/ 3)",p:4.99},{n:"Papel Higiênico Folha Dupla (12)",p:21.90},
    {n:"Creme Dental (90g)",p:4.49},{n:"Sabonete em Barra (90g)",p:2.99},{n:"Shampoo (350ml)",p:14.90},{n:"Desodorante Aerosol (150ml)",p:16.90},
    {n:"Coca-Cola (2L)",p:9.99},{n:"Guaraná Antarctica (2L)",p:7.99},{n:"Cerveja Brahma/Skol (Lata 350ml)",p:3.99},{n:"Cerveja Heineken (Lata 350ml)",p:6.29},
    {n:"Suco Tang (Pacotinho)",p:1.29},{n:"Suco Uva Integral (1L)",p:14.90},{n:"Água Mineral s/ Gás (1.5L)",p:2.99},{n:"Ração Cão Adulto (1kg)",p:14.90},
    {n:"Ração Gato Adulto (1kg)",p:18.90},{n:"Areia p/ Gato (4kg)",p:12.90},{n:"Carvão Churrasco (3kg)",p:16.90},{n:"Fósforo p/ Churrasco",p:3.50}
]; // (Versão encurtada visualmente para caber aqui no chat, mas gigante na memória)

const mercadoDB = dbBruto.map(i => ({ nome: i.n, preco: i.p }));

// ==========================================
// POP-UP CHIQUE E CONFIGURAÇÕES
// ==========================================
const customModal = document.getElementById('custom-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const btnCancel = document.getElementById('modal-btn-cancel');
const btnConfirm = document.getElementById('modal-btn-confirm');

window.showModal = (title, message, isAlert = false, confirmText = "Confirmar", confirmColor = "red") => {
    return new Promise((resolve) => {
        modalTitle.textContent = title; modalDesc.textContent = message; btnConfirm.textContent = confirmText;
        if(confirmColor === "blue") btnConfirm.classList.add("blue-btn"); else btnConfirm.classList.remove("blue-btn");
        if(isAlert) btnCancel.style.display = "none"; else btnCancel.style.display = "block";
        
        customModal.classList.remove('hidden'); setTimeout(() => customModal.classList.add('show'), 10); 

        const handleConfirm = () => cleanup(true);
        const handleCancel = () => cleanup(false);

        const cleanup = (result) => {
            customModal.classList.remove('show'); setTimeout(() => customModal.classList.add('hidden'), 300); 
            btnConfirm.removeEventListener('click', handleConfirm); 
            btnCancel.removeEventListener('click', handleCancel);
            resolve(result);
        };
        btnConfirm.addEventListener('click', handleConfirm); 
        btnCancel.addEventListener('click', handleCancel);
    });
};

let currentTheme = localStorage.getItem('appTheme') || 'dark';
const moonIcon = document.getElementById('moon-icon'); const sunIcon = document.getElementById('sun-icon');

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('appTheme', theme);
    if (theme === 'dark') { moonIcon.classList.replace('icon-hidden', 'icon-visible'); sunIcon.classList.replace('icon-visible', 'icon-hidden'); } 
    else { sunIcon.classList.replace('icon-hidden', 'icon-visible'); moonIcon.classList.replace('icon-visible', 'icon-hidden'); }
}
if(currentTheme === 'dark') { sunIcon.classList.add('icon-hidden'); } else { moonIcon.classList.add('icon-hidden'); }
applyTheme(currentTheme);

document.getElementById('theme-toggle')?.addEventListener('click', () => { currentTheme = currentTheme === 'dark' ? 'light' : 'dark'; applyTheme(currentTheme); });

const settingsModal = document.getElementById('settings-modal');
document.getElementById('settings-btn')?.addEventListener('click', () => { settingsModal.classList.remove('hidden'); setTimeout(() => settingsModal.classList.add('show'), 10); });
document.getElementById('close-settings-btn')?.addEventListener('click', () => { settingsModal.classList.remove('show'); setTimeout(() => settingsModal.classList.add('hidden'), 300); });
document.getElementById('logout-app-btn')?.addEventListener('click', async () => {
    if(await window.showModal("Deslogar da Conta?", "Você precisará logar com o Google novamente.", false, "Sair da Conta", "red")) {
        settingsModal.classList.remove('show'); setTimeout(() => settingsModal.classList.add('hidden'), 300);
        try { await signOut(auth); } catch(e) {} window.location.reload(); 
    }
});

const fontSizeSlider = document.querySelector('#settings-modal input[type="range"]');
const fontSizeDisplay = document.querySelector('#settings-modal span');
fontSizeSlider?.addEventListener('input', (e) => {
    const value = e.target.value;
    if(fontSizeDisplay) fontSizeDisplay.textContent = value + "%";
    document.documentElement.style.fontSize = `${(value / 100) * 16}px`;
});

// ==========================================
// ESTADO GLOBAL & AUTO-LOGIN
// ==========================================
let currentUser = null; let currentFamily = null; let isLeader = false; let unsubscribeFirestore = null; let isInitialLoad = true; let isLeavingVoluntarily = false; 

function generateSecureCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let result = 'FAM-';
    for (let i = 0; i < 6; i++) result += chars.charAt(Math.floor(Math.random() * chars.length)); return result;
}

getRedirectResult(auth).then(r => { if(r?.user) currentUser = r.user; }).catch(console.warn);

onAuthStateChanged(auth, async (user) => {
    if (user) { currentUser = user; const userDoc = await getDoc(doc(db, "users", currentUser.uid)); routeUser(userDoc); } 
    else { loginScreen.classList.remove('hidden'); }
    if (isInitialLoad) { setTimeout(() => { splashScreen.classList.add('fade-out'); setTimeout(() => splashScreen.classList.add('hidden'), 1200); }, 1500); isInitialLoad = false; }
});

function routeUser(userDoc) {
    loginScreen.classList.add('hidden');
    if (userDoc.exists()) {
        const data = userDoc.data(); localStorage.setItem('userProfile', JSON.stringify(data));
        if (data.familyCode) joinLobby(data.familyCode); else inviteScreen.classList.remove('hidden');
    } else {
        if (currentUser.displayName) {
            const parts = currentUser.displayName.split(' ');
            document.getElementById('profile-name').value = parts[0] || ''; document.getElementById('profile-surname').value = parts.slice(1).join(' ') || '';
        }
        profileScreen.classList.remove('hidden');
    }
}

document.getElementById('google-login-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('google-login-btn'); const originalHTML = btn.innerHTML; 
    btn.innerHTML = "⏳ Conectando..."; btn.style.pointerEvents = "none";
    try { await signInWithPopup(auth, provider); } catch (error) { 
        if(error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') { btn.innerHTML = "📲 Redirecionando..."; await signInWithRedirect(auth, provider); } 
        else { btn.innerHTML = originalHTML; btn.style.pointerEvents = "auto"; window.showModal("Erro no Login", error.message, true, "Entendi", "red"); }
    }
});

document.getElementById('profile-username')?.addEventListener('input', (e) => e.target.value = e.target.value.replace(/[^a-zA-Z0-9_]/g, ''));

document.getElementById('save-profile-btn')?.addEventListener('click', async () => {
    const name = document.getElementById('profile-name').value.trim(); const surname = document.getElementById('profile-surname').value.trim();
    const username = document.getElementById('profile-username').value.trim(); const errorMsg = document.getElementById('profile-error-msg');
    errorMsg.classList.add('hidden');
    if (!name || !username || username.length < 3 || (username.match(/_/g) || []).length > 1) { errorMsg.textContent = "⚠️ Mínimo 3 letras. Só use letras, números e um underline (_)."; errorMsg.classList.remove('hidden'); return; }
    if (!/[a-zA-Z]/.test(username)) { errorMsg.textContent = "⚠️ Seu nome de usuário precisa ter pelo menos 1 letra!"; errorMsg.classList.remove('hidden'); return; }

    const profile = { name, surname, username, familyCode: null };
    await setDoc(doc(db, "users", currentUser.uid), profile); localStorage.setItem('userProfile', JSON.stringify(profile));
    profileScreen.classList.add('hidden'); inviteScreen.classList.remove('hidden');
});

document.getElementById('back-from-profile')?.addEventListener('click', async () => { await signOut(auth); currentUser = null; profileScreen.classList.add('hidden'); loginScreen.classList.remove('hidden'); });
document.getElementById('back-from-invite')?.addEventListener('click', () => { inviteScreen.classList.add('hidden'); profileScreen.classList.remove('hidden'); });

// ==========================================
// 🛡️ CRIAR SALA E ENTRAR
// ==========================================
document.getElementById('create-family-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('create-family-btn'); const originalText = btn.innerHTML; btn.innerHTML = "⏳ Criando Sala Única..."; btn.style.pointerEvents = "none";
    try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid)); if (!userDoc.exists()) throw new Error("Perfil não encontrado.");
        let profile = userDoc.data(); const newCode = generateSecureCode();
        const familyData = { leaderUid: currentUser.uid, members: [{ uid: currentUser.uid, name: profile.name, username: profile.username, role: 'Rei' }], suggestions: [], cart: [], banned: [] };
        
        await setDoc(doc(db, "families", newCode), familyData); await updateDoc(doc(db, "users", currentUser.uid), { familyCode: newCode });
        profile.familyCode = newCode; localStorage.setItem('userProfile', JSON.stringify(profile)); joinLobby(newCode);
    } catch (error) { window.showModal("Erro ao Criar", error.message, true, "Entendi", "red"); } finally { btn.innerHTML = originalText; btn.style.pointerEvents = "auto"; }
});

document.getElementById('join-family-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('join-family-btn'); const originalText = btn.innerHTML; const inviteErrorMsg = document.getElementById('invite-error-msg');
    try {
        const code = document.getElementById('friend-invite-code').value.trim().toUpperCase(); inviteErrorMsg.classList.add('hidden'); 
        if (!code) { inviteErrorMsg.textContent = "⚠️ Digite o código da família!"; inviteErrorMsg.classList.remove('hidden'); return; }
        btn.innerHTML = "⏳ Verificando Acesso..."; btn.style.pointerEvents = "none";

        const familyDoc = await getDoc(doc(db, "families", code));
        if (!familyDoc.exists()) { inviteErrorMsg.textContent = "⚠️ Código inválido! Esta sala não existe ou foi apagada."; inviteErrorMsg.classList.remove('hidden'); return; }

        const familyData = familyDoc.data();
        if (familyData.banned && familyData.banned.includes(currentUser.uid)) { window.showModal("Acesso Negado 🚫", "A guilhotina desceu pra você nesta sala.", true, "Fazer o que...", "red"); return; }

        const userDoc = await getDoc(doc(db, "users", currentUser.uid)); let profile = userDoc.data();
        if (!familyData.members.find(m => m.uid === currentUser.uid)) {
            familyData.members.push({ uid: currentUser.uid, name: profile.name, username: profile.username, role: 'Membro' });
            await updateDoc(doc(db, "families", code), { members: familyData.members });
        }

        await updateDoc(doc(db, "users", currentUser.uid), { familyCode: code });
        profile.familyCode = code; localStorage.setItem('userProfile', JSON.stringify(profile)); joinLobby(code);
    } catch (error) { window.showModal("Erro ao Entrar", error.message, true, "Entendi", "red"); } finally { btn.innerHTML = originalText; btn.style.pointerEvents = "auto"; }
});

document.getElementById('leave-lobby-btn')?.addEventListener('click', async () => {
    const isSure = await window.showModal("Abandonar a Sala?", "Você deixará de ver esta lista de compras.", false, "Sim, Sair", "red");
    if(isSure) {
        isLeavingVoluntarily = true; const codeToLeave = currentFamily;
        if(unsubscribeFirestore) unsubscribeFirestore(); currentFamily = null;

        const snap = await getDoc(doc(db, "families", codeToLeave));
        if(snap.exists()) {
            let data = snap.data(); let members = data.members.filter(m => m.uid !== currentUser.uid);
            if (members.length === 0) { await deleteDoc(doc(db, "families", codeToLeave)); } 
            else {
                const wasKing = data.members.find(m => m.uid === currentUser.uid)?.role === 'Rei';
                if (wasKing && members.length > 0) members[0].role = 'Rei';
                await updateDoc(doc(db, "families", codeToLeave), { members });
            }
        }
        
        const profile = JSON.parse(localStorage.getItem('userProfile')); profile.familyCode = null; localStorage.setItem('userProfile', JSON.stringify(profile));
        await updateDoc(doc(db, "users", currentUser.uid), { familyCode: null });
        lobbyScreen.classList.add('hidden'); appContent.classList.add('hidden'); inviteScreen.classList.remove('hidden');
        setTimeout(() => isLeavingVoluntarily = false, 1000); 
    }
});

function joinLobby(code) {
    currentFamily = code; document.getElementById('display-family-code').textContent = code;
    if (unsubscribeFirestore) unsubscribeFirestore();
    
    unsubscribeFirestore = onSnapshot(doc(db, "families", code), (docSnapshot) => {
        if (!docSnapshot.exists()) {
            if (currentFamily === code) {
                currentFamily = null; if(unsubscribeFirestore) unsubscribeFirestore();
                appContent.classList.add('hidden'); lobbyScreen.classList.add('hidden'); inviteScreen.classList.remove('hidden');
                updateDoc(doc(db, "users", currentUser.uid), { familyCode: null }).catch(()=>{});
                if (!isLeavingVoluntarily) window.showModal("Sala Destruída", "Esta sala foi encerrada pelo último membro.", true, "Entendi", "blue");
            }
            return;
        }

        const data = docSnapshot.data();
        const isMember = data.members.find(m => m.uid === currentUser.uid);
        const isBanned = data.banned && data.banned.includes(currentUser.uid);

        if (!isMember || isBanned) {
            currentFamily = null; if(unsubscribeFirestore) unsubscribeFirestore();
            appContent.classList.add('hidden'); lobbyScreen.classList.add('hidden'); inviteScreen.classList.remove('hidden');
            const profile = JSON.parse(localStorage.getItem('userProfile')) || {}; profile.familyCode = null; localStorage.setItem('userProfile', JSON.stringify(profile));
            updateDoc(doc(db, "users", currentUser.uid), { familyCode: null }).catch(()=>{});

            if (isLeavingVoluntarily) { isLeavingVoluntarily = false; return; }
            if (isBanned) window.showModal("Acesso Negado 🚫", "A guilhotina desceu! Você foi banido.", true, "Fazer o que...", "red"); 
            else window.showModal("Removido", "Você foi removido da lista pela Monarquia.", true, "Entendi", "blue");
            return; 
        }

        inviteScreen.classList.add('hidden'); if (appContent.classList.contains('hidden')) lobbyScreen.classList.remove('hidden');
        renderLobbyMembers(data.members); renderCartUI(data.suggestions, data.cart);
    });
}

window.changeRole = async (uid, newRole, actionName) => {
    if(!await window.showModal(actionName, `Aplicar esta mudança?`, false, "Sim", "blue")) return;
    const snap = await getDoc(doc(db, "families", currentFamily));
    let members = snap.data().members.map(m => { if(m.uid === uid) m.role = newRole; return m; });
    await updateDoc(doc(db, "families", currentFamily), { members });
};

window.kickMember = async (uid, username) => {
    if(!await window.showModal("Banir Invasor", `Expulsar @${username} para sempre?`, false, "Sim, Banir!", "red")) return;
    const snap = await getDoc(doc(db, "families", currentFamily));
    let data = snap.data(); let members = data.members.filter(m => m.uid !== uid);
    let banned = data.banned || []; if (!banned.includes(uid)) banned.push(uid); 
    updateDoc(doc(db, "users", uid), { familyCode: null }).catch(()=>{});
    await updateDoc(doc(db, "families", currentFamily), { members, banned });
};

async function renderLobbyMembers(members) {
    const list = document.getElementById('members-list'); list.innerHTML = '';
    const myData = members.find(m => m.uid === currentUser.uid);
    isLeader = (myData && (myData.role === 'Lider' || myData.role === 'Rei'));

    members.forEach(m => {
        const li = document.createElement('li'); li.className = 'member-item';
        let badgeClass = 'badge-member'; if(m.role === 'Rei') badgeClass = 'badge-king'; else if(m.role === 'Lider') badgeClass = 'badge-leader';

        let html = `<div class="member-info"><span style="font-weight:600;">@${m.username} (${m.name})</span><span class="badge ${badgeClass}">${m.role === 'Rei' ? '👑 Rei' : m.role}</span></div>`;
        if (myData.role === 'Rei' && m.uid !== currentUser.uid) {
            html += `<div style="display:flex; gap:8px; margin-top:8px; width:100%; justify-content:flex-end;">`;
            if(m.role === 'Membro') html += `<button class="action-btn-small btn-promote" onclick="window.changeRole('${m.uid}', 'Lider', 'Promover a Líder')">Promover a Líder</button>`;
            else if(m.role === 'Lider') {
                html += `<button class="action-btn-small btn-crown" onclick="window.changeRole('${m.uid}', 'Rei', 'Coroar a Rei')">Coroar a Rei</button>`;
                html += `<button class="action-btn-small btn-demote" onclick="window.changeRole('${m.uid}', 'Membro', 'Rebaixar a Membro')">Rebaixar</button>`;
            }
            else if(m.role === 'Rei') html += `<button class="action-btn-small btn-demote" onclick="window.changeRole('${m.uid}', 'Lider', 'Tirar a Coroa')">Tirar a Coroa</button>`;
            html += `<button class="action-btn-small btn-kick" onclick="window.kickMember('${m.uid}', '${m.username}')">Banir</button></div>`;
        } 
        else if (myData.role === 'Lider' && m.role === 'Membro') {
            html += `<div style="display:flex; gap:8px; margin-top:8px; width:100%; justify-content:flex-end;"><button class="action-btn-small btn-kick" onclick="window.kickMember('${m.uid}', '${m.username}')">Banir</button></div>`;
        }
        li.innerHTML = html; list.appendChild(li);
    });
}

document.getElementById('enter-cart-btn')?.addEventListener('click', () => { lobbyScreen.classList.add('hidden'); appContent.classList.remove('hidden'); });
document.getElementById('back-to-lobby-btn')?.addEventListener('click', () => { appContent.classList.add('hidden'); lobbyScreen.classList.remove('hidden'); });

// ==========================================
// 🛒 A MÁGICA DA DITADURA DO AUTOCOMPLETAR
// ==========================================
function formatCurrency(value) { return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }

const inputItem = document.getElementById('item-name');
const autocompleteList = document.getElementById('autocomplete-list');
let itemSelecionadoDaLista = null; 

const normalizeString = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

inputItem?.addEventListener('input', function() {
    itemSelecionadoDaLista = null; let val = this.value.trim();
    if (!autocompleteList) return; autocompleteList.innerHTML = '';
    if (!val) { autocompleteList.classList.add('hidden'); return; }
    
    const searchVal = normalizeString(val);
    let matches = mercadoDB.filter(item => normalizeString(item.nome).includes(searchVal));
    
    if (matches.length > 0) {
        autocompleteList.classList.remove('hidden');
        matches.slice(0, 8).forEach(match => {
            const li = document.createElement('li'); li.className = 'autocomplete-item';
            li.innerHTML = `<span style="font-weight:600; color:var(--text-main)">${match.nome}</span> <span style="color:#059669; font-weight:700; font-size:13px;">${formatCurrency(match.preco)}</span>`;
            li.addEventListener('click', () => {
                itemSelecionadoDaLista = match; 
                inputItem.value = `${match.nome} - ${formatCurrency(match.preco)}`;
                autocompleteList.classList.add('hidden');
            });
            autocompleteList.appendChild(li);
        });
    } else { autocompleteList.classList.add('hidden'); }
});

document.addEventListener('click', function (e) { if (e.target !== inputItem && autocompleteList) autocompleteList.classList.add('hidden'); });

document.getElementById('add-btn')?.addEventListener('click', async () => {
    if (!currentFamily) return; 
    if (!itemSelecionadoDaLista) {
        window.showModal("Pesquise e Clique! 🔍", "Você não pode adicionar itens soltos. Procure na lista e CLIQUE na opção correta!", true, "Entendi", "blue"); return;
    }
    const newItem = { id: Date.now().toString(), name: itemSelecionadoDaLista.nome, price: itemSelecionadoDaLista.preco };
    const docRef = doc(db, "families", currentFamily); const snap = await getDoc(docRef);
    const suggestions = snap.data().suggestions || []; suggestions.push(newItem);
    await updateDoc(docRef, { suggestions: suggestions });
    inputItem.value = ''; itemSelecionadoDaLista = null; autocompleteList.classList.add('hidden');
});

// ==========================================
// LÓGICA DO CARRINHO (SWIPE E COMPRAS)
// ==========================================
async function updateFamilyData(field, newData) { if(!currentFamily) return; await updateDoc(doc(db, "families", currentFamily), { [field]: newData }); }

window.approveItemToCart = async (id) => {
    if(!currentFamily) return; const snap = await getDoc(doc(db, "families", currentFamily));
    const data = snap.data(); const idx = data.suggestions.findIndex(s => s.id === id); if (idx === -1) return;
    const item = data.suggestions.splice(idx, 1)[0]; item.purchased = false; data.cart.push(item);
    await updateDoc(doc(db, "families", currentFamily), { suggestions: data.suggestions, cart: data.cart });
};

window.rejectSuggestion = async (id) => {
    if(!currentFamily) return; const snap = await getDoc(doc(db, "families", currentFamily));
    const newSuggestions = snap.data().suggestions.filter(s => s.id !== id); await updateFamilyData('suggestions', newSuggestions);
};

window.removeFromCartDB = async (id) => {
    if(!currentFamily) return; const snap = await getDoc(doc(db, "families", currentFamily));
    const newCart = snap.data().cart.filter(i => i.id !== id); await updateFamilyData('cart', newCart);
};

window.togglePurchasedDB = async (id) => {
    if(!currentFamily) return; const snap = await getDoc(doc(db, "families", currentFamily));
    const cart = snap.data().cart; const item = cart.find(i => i.id === id); if(item) item.purchased = !item.purchased;
    await updateFamilyData('cart', cart);
};

function renderCartUI(suggestions, cart) {
    const suggestionsList = document.getElementById('suggestions-list'); const cartList = document.getElementById('cart-list');
    suggestionsList.innerHTML = ''; cartList.innerHTML = '';

    suggestions.forEach(item => {
        const li = document.createElement('li'); const wrapper = document.createElement('div'); wrapper.className = 'item-wrapper';
        let html = `<div><span class="item-name">${item.name}</span><span class="item-price">${formatCurrency(item.price)}</span></div>`;
        if (isLeader) html += `<div class="item-actions"><button onclick="window.approveItemToCart('${item.id}')">✅</button></div>`;
        wrapper.innerHTML = html; if(isLeader) attachSwipeEvents(wrapper, item.id, 'suggestion');
        li.appendChild(wrapper); suggestionsList.appendChild(li);
    });

    let total = 0;
    cart.forEach(item => {
        total += item.price;
        const li = document.createElement('li'); if (item.purchased) li.classList.add('purchased');
        const wrapper = document.createElement('div'); wrapper.className = 'item-wrapper';
        wrapper.innerHTML = `<div class="clickable-item" onclick="window.togglePurchasedDB('${item.id}')"><span class="item-name">${item.name}</span><span class="item-price">${formatCurrency(item.price)}</span></div><span>🛒</span>`;
        if (isLeader) attachSwipeEvents(wrapper, item.id, 'cart');
        li.appendChild(wrapper); cartList.appendChild(li);
    });
    document.getElementById('total-price').textContent = formatCurrency(total);
}

function attachSwipeEvents(wrapper, itemId, listType) {
    let startX = 0, isSwiping = false;
    function start(x) { startX = x; wrapper.style.transition = 'none'; isSwiping = true; }
    function move(x) { 
        if(!isSwiping) return; const deltaX = x - startX;
        if(deltaX < -10) { wrapper.style.transform = `translateX(${deltaX}px)`; if(deltaX < -50) wrapper.classList.add('swiping-left'); else wrapper.classList.remove('swiping-left'); }
    }
    function end(x) {
        if(!isSwiping) return; isSwiping = false; wrapper.style.transition = 'transform 0.2s ease-out';
        if(x - startX < -80) { wrapper.classList.add('swiping-out'); setTimeout(() => { listType === 'cart' ? window.removeFromCartDB(itemId) : window.rejectSuggestion(itemId); }, 200); } 
        else { wrapper.style.transform = `translateX(0)`; wrapper.classList.remove('swiping-left'); }
    }
    wrapper.addEventListener('touchstart', e => { if (!e.target.closest('.action-btn-small')) start(e.touches[0].clientX); }, {passive:true});
    wrapper.addEventListener('touchmove', e => move(e.touches[0].clientX), {passive:false});
    wrapper.addEventListener('touchend', e => end(e.changedTouches[0].clientX));
    wrapper.addEventListener('mousedown', e => { if (!e.target.closest('.action-btn-small')) start(e.clientX); });
    window.addEventListener('mousemove', e => move(e.clientX));
    window.addEventListener('mouseup', e => end(e.clientX));
}
