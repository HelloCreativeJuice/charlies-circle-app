import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { supabase } from '../lib/supabase'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'hello@iamthecreativejuice.com'
const ADMIN_PASSWORD = 'charliemulan2026'
const AVATAR_COLORS = ['#C8813A','#D4C5B0','#B5C9C0','#C4B5A0','#A0B5C4','#C4A0B5']

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');
  :root { --paper:#F5F0E8; --paper-dark:#EDE7D9; --ink:#1A1612; --ink-mid:#3D342A; --ink-light:#7A6E62; --amber:#C8813A; --rule:rgba(26,22,18,0.12); }
  *{margin:0;padding:0;box-sizing:border-box;}
  body{background:var(--paper);color:var(--ink);font-family:'DM Sans',sans-serif;font-weight:300;}
  ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:rgba(26,22,18,0.12);border-radius:2px;}
  input,textarea,button{font-family:'DM Sans',sans-serif;}
  a{color:inherit;}
`

export default function Portal() {
  const [screen, setScreen] = useState('login')
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentMember, setCurrentMember] = useState(null)
  const [allMembers, setAllMembers] = useState([])
  const [activePage, setActivePage] = useState('home')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [adminTab, setAdminTab] = useState('member')
  const [deliverables, setDeliverables] = useState([])
  const [opportunities, setOpportunities] = useState([])
  const [messages, setMessages] = useState([])
  const [requests, setRequests] = useState([])
  const [communityMembers, setCommunityMembers] = useState([])
  const [activeMessage, setActiveMessage] = useState(null)
  const [uploadDesc, setUploadDesc] = useState('')
  const [uploadNotes, setUploadNotes] = useState('')
  const [uploadStatus, setUploadStatus] = useState('')
  const fileInputRef = useRef()
  const [aForm, setAForm] = useState({})
  const [adminDeliverables, setAdminDeliverables] = useState([])
  const [adminOpportunities, setAdminOpportunities] = useState([])
  const [adminMessages, setAdminMessages] = useState([])
  const [adminRequests, setAdminRequests] = useState([])
  const [showAddDel, setShowAddDel] = useState(false)
  const [showAddOpp, setShowAddOpp] = useState(false)
  const [showAddMsg, setShowAddMsg] = useState(false)
  const [showAddReq, setShowAddReq] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [newDel, setNewDel] = useState({})
  const [newOpp, setNewOpp] = useState({})
  const [newMsg, setNewMsg] = useState({})
  const [newReq, setNewReq] = useState({})
  const [newMem, setNewMem] = useState({})
  const [saveStatus, setSaveStatus] = useState({})
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  async function handleLogin() {
    setLoginError('')
    setLoginLoading(true)
    if (loginEmail === ADMIN_EMAIL && loginPassword === ADMIN_PASSWORD) {
      setIsAdmin(true)
      await loadAllMembers()
      setScreen('portal')
      setActivePage('admin-home')
      setLoginLoading(false)
      return
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword })
    if (error) {
      setLoginError('Invalid email or password.')
      setLoginLoading(false)
      return
    }
    const { data: memberData } = await supabase.from('members').select('*').eq('email', loginEmail).single()
    if (memberData) {
      setCurrentMember(memberData)
      await loadMemberData(memberData.id)
    }
    setIsAdmin(false)
    setScreen('portal')
    setActivePage('home')
    setLoginLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setScreen('login')
    setIsAdmin(false)
    setCurrentMember(null)
    setActivePage('home')
    setLoginEmail('')
    setLoginPassword('')
  }

  async function loadAllMembers() {
    const { data } = await supabase.from('members').select('*').order('created_at')
    if (data) {
      setAllMembers(data)
      if (data.length > 0 && !currentMember) {
        setCurrentMember(data[0])
        await loadMemberData(data[0].id)
      }
    }
  }

  async function loadMemberData(memberId) {
    const [dels, opps, msgs, reqs, community] = await Promise.all([
      supabase.from('deliverables').select('*').eq('member_id', memberId).order('created_at', { ascending: false }),
      supabase.from('opportunities').select('*').eq('member_id', memberId).order('created_at', { ascending: false }),
      supabase.from('messages').select('*').eq('member_id', memberId).order('created_at', { ascending: false }),
      supabase.from('file_requests').select('*').eq('member_id', memberId).eq('status', 'pending').order('created_at', { ascending: false }),
      supabase.from('members').select('name, brand, building_short').order('created_at'),
    ])
    if (dels.data) setDeliverables(dels.data)
    if (opps.data) setOpportunities(opps.data)
    if (msgs.data) setMessages(msgs.data)
    if (reqs.data) setRequests(reqs.data)
    if (community.data) setCommunityMembers(community.data)
  }

  async function loadAdminData(memberId) {
    const { data: m } = await supabase.from('members').select('*').eq('id', memberId).single()
    if (m) setAForm(m)
    const [dels, opps, msgs, reqs] = await Promise.all([
      supabase.from('deliverables').select('*').eq('member_id', memberId).order('created_at', { ascending: false }),
      supabase.from('opportunities').select('*').eq('member_id', memberId).order('created_at', { ascending: false }),
      supabase.from('messages').select('*').eq('member_id', memberId).order('created_at', { ascending: false }),
      supabase.from('file_requests').select('*').eq('member_id', memberId).order('created_at', { ascending: false }),
    ])
    if (dels.data) setAdminDeliverables(dels.data)
    if (opps.data) setAdminOpportunities(opps.data)
    if (msgs.data) setAdminMessages(msgs.data)
    if (reqs.data) setAdminRequests(reqs.data)
  }

  async function switchMember(member) {
    setCurrentMember(member)
    await loadMemberData(member.id)
    await loadAdminData(member.id)
  }

  async function saveMemberInfo() {
    const { error } = await supabase.from('members').update(aForm).eq('id', currentMember.id)
    if (error) showSaveStatus('member', error.message, 'error')
    else {
      showSaveStatus('member', 'Saved.', 'success')
      await loadAllMembers()
      setCurrentMember({ ...currentMember, ...aForm })
      await loadMemberData(currentMember.id)
    }
  }

  async function addDeliverable() {
    const { error } = await supabase.from('deliverables').insert({ ...newDel, member_id: currentMember.id })
    if (error) showSaveStatus('del', error.message, 'error')
    else {
      showSaveStatus('del', 'Added.', 'success')
      setNewDel({})
      setShowAddDel(false)
      await loadMemberData(currentMember.id)
      await loadAdminData(currentMember.id)
    }
  }

  async function addOpportunity() {
    const { error } = await supabase.from('opportunities').insert({ ...newOpp, member_id: currentMember.id })
    if (error) showSaveStatus('opp', error.message, 'error')
    else {
      showSaveStatus('opp', 'Added.', 'success')
      setNewOpp({})
      setShowAddOpp(false)
      await loadMemberData(currentMember.id)
      await loadAdminData(currentMember.id)
    }
  }

  async function addMessage() {
    const { error } = await supabase.from('messages').insert({ ...newMsg, member_id: currentMember.id })
    if (error) showSaveStatus('msg', error.message, 'error')
    else {
      showSaveStatus('msg', 'Added.', 'success')
      setNewMsg({})
      setShowAddMsg(false)
      await loadMemberData(currentMember.id)
      await loadAdminData(currentMember.id)
    }
  }

  async function addRequest() {
    const { error } = await supabase.from('file_requests').insert({ ...newReq, member_id: currentMember.id, status: 'pending' })
    if (error) showSaveStatus('req', error.message, 'error')
    else {
      showSaveStatus('req', 'Request sent.', 'success')
      setNewReq({})
      setShowAddReq(false)
      await loadMemberData(currentMember.id)
      await loadAdminData(currentMember.id)
    }
  }

  async function deleteItem(table, id) {
    if (!confirm('Remove this item?')) return
    await supabase.from(table).delete().eq('id', id)
    await loadMemberData(currentMember.id)
    await loadAdminData(currentMember.id)
  }

  async function createMember() {
    if (!newMem.email || !newMem.password || !newMem.name) {
      showSaveStatus('newmem', 'Name, email and password required.', 'error')
      return
    }
    await supabase.auth.signUp({ email: newMem.email, password: newMem.password })
    const { error } = await supabase.from('members').insert({
      name: newMem.name,
      email: newMem.email,
      brand: newMem.brand || '',
      industry: newMem.industry || '',
      location: newMem.location || '',
      tier: 'Member',
      member_since: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      sessions_completed: 0
    })
    if (error) showSaveStatus('newmem', error.message, 'error')
    else {
      showSaveStatus('newmem', `Created. Login: ${newMem.email} / ${newMem.password}`, 'success')
      setNewMem({})
      setShowAddMember(false)
      await loadAllMembers()
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploadStatus('uploading')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('description', uploadDesc || file.name)
    formData.append('memberId', currentMember?.id || '')
    try {
      const res = await fetch('/api/drive/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        await supabase.from('member_submissions').insert({
          member_id: currentMember?.id,
          description: uploadDesc,
          notes: uploadNotes,
          file_url: data.viewLink,
          file_name: data.fileName
        })
        setUploadStatus('success')
        setUploadDesc('')
        setUploadNotes('')
        e.target.value = ''
      } else {
        setUploadStatus('error')
      }
    } catch {
      setUploadStatus('error')
    }
  }

  function showSaveStatus(key, msg, type) {
    setSaveStatus(s => ({ ...s, [key]: { msg, type } }))
    setTimeout(() => setSaveStatus(s => ({ ...s, [key]: null })), 4000)
  }

  function getInitial(name) { return name ? name[0].toUpperCase() : '?' }
  const firstName = currentMember?.name?.split(' ')[0] || 'there'
  const newDelCount = deliverables.filter(d => d.is_new).length

  function StatusMsg({ id }) {
    if (!saveStatus[id]) return null
    return (
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, padding: '10px 14px', marginTop: 12, background: saveStatus[id].type === 'success' ? 'rgba(123,174,127,0.1)' : 'rgba(192,57,43,0.1)', color: saveStatus[id].type === 'success' ? '#4a8a4f' : '#C0392B', border: `1px solid ${saveStatus[id].type === 'success' ? 'rgba(123,174,127,0.3)' : 'rgba(192,57,43,0.3)'}` }}>
        {saveStatus[id].msg}
      </div>
    )
  }

  if (screen === 'login') {
    return (
      <>
        <Head><title>Charlie&apos;s Circle</title></Head>
        <style>{globalStyles}</style>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ink)' }}>
          <div style={{ width: 400, padding: '56px 48px', border: '1px solid rgba(245,240,232,0.1)', background: 'rgba(245,240,232,0.03)' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.3)', marginBottom: 6 }}>Charlie Mulan</div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 32, fontWeight: 300, color: '#F5F0E8', marginBottom: 4 }}>Charlie&apos;s Circle</div>
            <div style={{ fontSize: 12, color: 'rgba(245,240,232,0.35)', marginBottom: 40 }}>Season 1 · Creators of New Earth</div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)', marginBottom: 8 }}>Email</label>
              <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} style={{ width: '100%', background: 'rgba(245,240,232,0.06)', border: '1px solid rgba(245,240,232,0.12)', color: '#F5F0E8', fontFamily: 'DM Sans, sans-serif', fontSize: 13, padding: '12px 14px', outline: 'none' }} placeholder="your@email.com" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)', marginBottom: 8 }}>Password</label>
              <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} style={{ width: '100%', background: 'rgba(245,240,232,0.06)', border: '1px solid rgba(245,240,232,0.12)', color: '#F5F0E8', fontFamily: 'DM Sans, sans-serif', fontSize: 13, padding: '12px 14px', outline: 'none' }} placeholder="••••••••" />
            </div>
            <button onClick={handleLogin} disabled={loginLoading} style={{ width: '100%', background: '#C8813A', color: '#1A1612', fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500, padding: 14, border: 'none', cursor: loginLoading ? 'not-allowed' : 'pointer', opacity: loginLoading ? 0.6 : 1, marginTop: 8 }}>
              {loginLoading ? 'Entering...' : 'Enter the Circle'}
            </button>
            {loginError && <div style={{ fontSize: 11, color: '#E8A0A0', marginTop: 12, textAlign: 'center' }}>{loginError}</div>}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head><title>Charlie&apos;s Circle — {currentMember?.name || 'Portal'}</title></Head>
      <style>{globalStyles}</style>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <aside style={{ width: 260, minHeight: '100vh', background: 'var(--ink)', display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100 }}>
          <div style={{ padding: '32px 28px 24px', borderBottom: '1px solid rgba(245,240,232,0.08)' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)', marginBottom: 4 }}>Charlie Mulan</div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, color: '#F5F0E8' }}>Charlie&apos;s Circle</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C8813A', marginTop: 6 }}>Season 1 · Creators of New Earth</div>
          </div>
          <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(245,240,232,0.08)' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#C8813A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: 18, fontWeight: 500, color: '#1A1612', marginBottom: 12 }}>{getInitial(currentMember?.name)}</div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, color: '#F5F0E8', marginBottom: 3 }}>{currentMember?.name || '—'}</div>
            <div style={{ fontSize: 11, color: 'rgba(245,240,232,0.45)', lineHeight: 1.4 }}>{currentMember?.brand ? currentMember.brand + ' · ' : ''}{currentMember?.building_short || ''}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', marginTop: 10, background: 'rgba(200,129,58,0.15)', border: '1px solid rgba(200,129,58,0.3)', padding: '4px 10px', borderRadius: 2 }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C8813A' }}>{currentMember?.tier || 'Member'}</span>
            </div>
          </div>
          <nav style={{ flex: 1, padding: '20px 0', overflowY: 'auto' }}>
            {isAdmin && (
              <>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.2)', padding: '16px 28px 8px' }}>Admin</div>
                <NavItem label="Admin Dashboard" active={activePage === 'admin-home'} onClick={() => setActivePage('admin-home')} />
              </>
            )}
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.2)', padding: '16px 28px 8px' }}>My Portal</div>
            <NavItem label="Home" active={activePage === 'home'} onClick={() => setActivePage('home')} />
            <NavItem label="My Deliverables" active={activePage === 'deliverables'} onClick={() => setActivePage('deliverables')} badge={deliverables.length || null} />
            <NavItem label="Opportunities" active={activePage === 'opportunities'} onClick={() => setActivePage('opportunities')} badge={opportunities.length || null} />
            <NavItem label="The Room" active={activePage === 'community'} onClick={() => setActivePage('community')} />
            <NavItem label="Messages" active={activePage === 'messages'} onClick={() => setActivePage('messages')} badge={messages.length || null} />
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.2)', padding: '16px 28px 8px', marginTop: 8 }}>My Work</div>
            <NavItem label="My Profile" active={activePage === 'profile'} onClick={() => setActivePage('profile')} />
            {!isAdmin && <NavItem label="Submit Files" active={activePage === 'submit'} onClick={() => setActivePage('submit')} />}
          </nav>
          <div style={{ padding: '20px 28px', borderTop: '1px solid rgba(245,240,232,0.08)' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.25)', marginBottom: 6 }}>Next Session</div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 14, color: 'rgba(245,240,232,0.7)' }}>{currentMember?.session_short || '—'}</div>
          </div>
        </aside>

        <main style={{ marginLeft: 260, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', borderBottom: '1px solid var(--rule)', background: 'var(--paper)', position: 'sticky', top: 0, zIndex: 50 }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 13, color: 'var(--ink-light)', letterSpacing: '0.05em' }}>{pageTitle(activePage)}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: '0.1em', color: 'var(--ink-light)' }}>{today}</div>
              {isAdmin && <button onClick={() => { setShowAdmin(true); loadAdminData(currentMember?.id) }} style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '8px 16px', border: '1px solid rgba(200,129,58,0.4)', background: 'transparent', color: '#C8813A', cursor: 'pointer' }}>Admin Panel</button>}
              <button onClick={handleLogout} style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '8px 16px', border: '1px solid var(--rule)', background: 'transparent', color: 'var(--ink-light)', cursor: 'pointer' }}>Sign Out</button>
            </div>
          </div>

          <div style={{ padding: 48, flex: 1, overflowY: 'auto', minHeight: 'calc(100vh - 69px)' }}>

            {activePage === 'home' && (
              <div>
                <div style={{ marginBottom: 48 }}>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C8813A', marginBottom: 10 }}>Good morning</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 42, fontWeight: 300, lineHeight: 1.1, color: 'var(--ink)', marginBottom: 16 }}>Welcome back,<br /><em style={{ fontStyle: 'italic', color: 'var(--ink-mid)' }}>{firstName}.</em></div>
                  <div style={{ fontSize: 13, color: 'var(--ink-light)', maxWidth: 520, lineHeight: 1.7 }}>Your work is in motion. Here is where it lives, grows, and gets the support it deserves.</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--rule)', border: '1px solid var(--rule)', marginBottom: 40 }}>
                  {[
                    { label: 'Member Since', value: currentMember?.member_since || '—', sub: 'Season 1 · ' + (currentMember?.tier || 'Member') },
                    { label: 'Sessions Completed', value: currentMember?.sessions_completed || '0', sub: 'Next: ' + (currentMember?.session_short || '—') },
                    { label: 'Deliverables', value: deliverables.length, sub: newDelCount > 0 ? `${newDelCount} new this week` : 'Up to date' },
                    { label: 'Opportunities', value: opportunities.length, sub: 'Curated this week' }
                  ].map((s, i) => (
                    <div key={i} style={{ background: 'var(--paper)', padding: '24px 28px' }}>
                      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 10 }}>{s.label}</div>
                      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: i === 0 ? 22 : 32, color: 'var(--ink)', lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-light)' }}>{s.sub}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div>
                    <div style={{ border: '1px solid var(--rule)', background: 'var(--paper)', marginBottom: 24 }}>
                      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mid)' }}>Recent Deliverables</span>
                        <button style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C8813A', cursor: 'pointer', border: 'none', background: 'none' }} onClick={() => setActivePage('deliverables')}>View All</button>
                      </div>
                      <div style={{ padding: 24 }}>
                        {deliverables.slice(0, 3).map(d => <DeliverableRow key={d.id} d={d} />)}
                        {deliverables.length === 0 && <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-light)', padding: '20px 0', textAlign: 'center' }}>No deliverables yet.</div>}
                      </div>
                    </div>
                    <div style={{ border: '1px solid var(--rule)', background: 'var(--paper)' }}>
                      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mid)' }}>This Week&apos;s Opportunities</span>
                        <button style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C8813A', cursor: 'pointer', border: 'none', background: 'none' }} onClick={() => setActivePage('opportunities')}>View All</button>
                      </div>
                      <div style={{ padding: 24 }}>
                        {opportunities.slice(0, 2).map(o => <OppRow key={o.id} o={o} />)}
                        {opportunities.length === 0 && <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--ink-light)', padding: '20px 0', textAlign: 'center' }}>No opportunities.</div>}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div style={{ background: 'var(--ink)', padding: 28, display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.3)' }}>Next Strategy Session</div>
                      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, fontWeight: 300, color: '#F5F0E8', lineHeight: 1.2 }}>{currentMember?.session_title || 'Strategy Session'}</div>
                      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#C8813A', letterSpacing: '0.08em' }}>{currentMember?.session_date || '—'}</div>
                      <div style={{ fontSize: 11, color: 'rgba(245,240,232,0.35)', lineHeight: 1.6, borderTop: '1px solid rgba(245,240,232,0.08)', paddingTop: 16 }}>{currentMember?.session_prep || 'Come with your current focus areas.'}</div>
                    </div>
                    <div style={{ border: '1px solid var(--rule)', background: 'var(--paper)' }}>
                      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mid)' }}>Messages</span>
                        <button style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C8813A', cursor: 'pointer', border: 'none', background: 'none' }} onClick={() => setActivePage('messages')}>View All</button>
                      </div>
                      <div style={{ padding: 24 }}>
                        {messages.slice(0, 3).map((m, i) => <MessageRow key={m.id} m={m} i={i} onClick={() => setActiveMessage(m)} />)}
                        {messages.length === 0 && <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--ink-light)', padding: '20px 0', textAlign: 'center' }}>No messages yet.</div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePage === 'admin-home' && (
              <div>
                <div style={{ marginBottom: 48 }}>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C8813A', marginBottom: 10 }}>Agency Overview</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 42, fontWeight: 300, lineHeight: 1.1, color: 'var(--ink)', marginBottom: 16 }}>Charlie&apos;s <em style={{ fontStyle: 'italic', color: 'var(--ink-mid)' }}>Circle</em></div>
                  <div style={{ fontSize: 13, color: 'var(--ink-light)', maxWidth: 520, lineHeight: 1.7 }}>Season 1 at a glance. All your active members and quick tools in one place.</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div style={{ border: '1px solid var(--rule)', background: 'var(--paper)' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--rule)' }}>
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mid)' }}>Active Members · Season 1</span>
                    </div>
                    <div style={{ padding: 24 }}>
                      {allMembers.map((m, i) => (
                        <div key={m.id} onClick={() => switchMember(m)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < allMembers.length - 1 ? '1px solid var(--rule)' : 'none', cursor: 'pointer' }}>
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: AVATAR_COLORS[i % AVATAR_COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontWeight: 500, color: 'var(--ink)', flexShrink: 0 }}>{getInitial(m.name)}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 15, color: 'var(--ink)', marginBottom: 2 }}>{m.name}{m.brand ? ' · ' + m.brand : ''}</div>
                            <div style={{ fontSize: 11, color: 'var(--ink-light)' }}>{m.retainer || '—'} · {m.tier || 'Member'}</div>
                          </div>
                          <div onClick={e => { e.stopPropagation(); switchMember(m); setShowAdmin(true); loadAdminData(m.id) }} style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C8813A', border: '1px solid rgba(200,129,58,0.3)', padding: '4px 10px', cursor: 'pointer' }}>Edit</div>
                        </div>
                      ))}
                      <div onClick={() => setShowAddMember(true)} style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C8813A', border: '1px dashed rgba(200,129,58,0.4)', padding: '12px 20px', textAlign: 'center', marginTop: 16, cursor: 'pointer' }}>+ Add New Member</div>
                    </div>
                  </div>
                  <div style={{ border: '1px solid var(--rule)', background: 'var(--paper)' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--rule)' }}>
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mid)' }}>Quick Actions · {currentMember?.name || '—'}</span>
                    </div>
                    <div style={{ padding: 24 }}>
                      {[
                        { label: 'Add Deliverable', action: () => { setShowAdmin(true); setAdminTab('deliverables'); setShowAddDel(true); loadAdminData(currentMember?.id) } },
                        { label: 'Add Opportunity', action: () => { setShowAdmin(true); setAdminTab('opportunities'); setShowAddOpp(true); loadAdminData(currentMember?.id) } },
                        { label: 'Send Message', action: () => { setShowAdmin(true); setAdminTab('messages'); setShowAddMsg(true); loadAdminData(currentMember?.id) } },
                        { label: 'Request a File', action: () => { setShowAdmin(true); setAdminTab('requests'); setShowAddReq(true); loadAdminData(currentMember?.id) } },
                        { label: 'Update Member Info', action: () => { setShowAdmin(true); setAdminTab('member'); loadAdminData(currentMember?.id) } }
                      ].map((a, i) => (
                        <div key={i} onClick={a.action} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: i < 4 ? '1px solid var(--rule)' : 'none', cursor: 'pointer' }}>
                          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 15, color: 'var(--ink)' }}>{a.label}</div>
                          <div style={{ color: '#C8813A', fontSize: 16 }}>→</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePage === 'deliverables' && (
              <div>
                <div style={{ marginBottom: 48 }}>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C8813A', marginBottom: 10 }}>Your Archive</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 32, fontWeight: 300, color: 'var(--ink)', marginBottom: 16 }}>My <em style={{ fontStyle: 'italic' }}>Deliverables</em></div>
                </div>
                <div style={{ border: '1px solid var(--rule)', background: 'var(--paper)' }}>
                  <div style={{ padding: 24 }}>
                    {deliverables.map(d => <DeliverableRow key={d.id} d={d} />)}
                    {deliverables.length === 0 && <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--ink-light)', padding: '20px 0', textAlign: 'center' }}>No deliverables yet.</div>}
                  </div>
                </div>
              </div>
            )}

            {activePage === 'opportunities' && (
              <div>
                <div style={{ marginBottom: 48 }}>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C8813A', marginBottom: 10 }}>Curated for You</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 32, fontWeight: 300, color: 'var(--ink)', marginBottom: 16 }}><em style={{ fontStyle: 'italic' }}>Opportunities</em></div>
                </div>
                <div style={{ border: '1px solid var(--rule)', background: 'var(--paper)' }}>
                  <div style={{ padding: 24 }}>
                    {opportunities.map(o => <OppRow key={o.id} o={o} />)}
                    {opportunities.length === 0 && <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--ink-light)', padding: '20px 0', textAlign: 'center' }}>No opportunities this week.</div>}
                  </div>
                </div>
              </div>
            )}

            {activePage === 'community' && (
              <div>
                <div style={{ marginBottom: 48 }}>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C8813A', marginBottom: 10 }}>Season 1</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 32, fontWeight: 300, color: 'var(--ink)', marginBottom: 16 }}><em style={{ fontStyle: 'italic' }}>The Room</em></div>
                  <div style={{ fontSize: 13, color: 'var(--ink-light)', maxWidth: 520, lineHeight: 1.7 }}>The people building alongside you.</div>
                </div>
                <div style={{ border: '1px solid var(--rule)', background: 'var(--paper)' }}>
                  <div style={{ padding: 24 }}>
                    {communityMembers.map((m, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < communityMembers.length - 1 ? '1px solid var(--rule)' : 'none' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: AVATAR_COLORS[i % AVATAR_COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: 15, fontWeight: 500, color: 'var(--ink)', flexShrink: 0 }}>{getInitial(m.name)}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 15, color: 'var(--ink)', marginBottom: 2 }}>{m.name}{m.brand ? ' · ' + m.brand : ''}</div>
                          <div style={{ fontSize: 11, color: 'var(--ink-light)' }}>{m.building_short}</div>
                        </div>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#7BAE7F' }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activePage === 'messages' && (
              <div>
                <div style={{ marginBottom: 48 }}>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C8813A', marginBottom: 10 }}>Direct</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 32, fontWeight: 300, color: 'var(--ink)', marginBottom: 16 }}><em style={{ fontStyle: 'italic' }}>Messages</em></div>
                </div>
                <div style={{ border: '1px solid var(--rule)', background: 'var(--paper)' }}>
                  <div style={{ padding: 24 }}>
                    {messages.map((m, i) => <MessageRow key={m.id} m={m} i={i} onClick={() => setActiveMessage(m)} />)}
                    {messages.length === 0 && <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--ink-light)', padding: '20px 0', textAlign: 'center' }}>No messages yet.</div>}
                  </div>
                </div>
              </div>
            )}

            {activePage === 'profile' && (
              <div>
                <div style={{ marginBottom: 48 }}>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C8813A', marginBottom: 10 }}>Your Identity</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 32, fontWeight: 300, color: 'var(--ink)', marginBottom: 16 }}>My <em style={{ fontStyle: 'italic' }}>Profile</em></div>
                </div>
                <div style={{ border: '1px solid var(--rule)', background: 'var(--paper)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 28, padding: 32, borderBottom: '1px solid var(--rule)' }}>
                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#C8813A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: 28, fontWeight: 500, color: '#1A1612', flexShrink: 0 }}>{getInitial(currentMember?.name)}</div>
                    <div>
                      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, color: 'var(--ink)', marginBottom: 4 }}>{currentMember?.name || '—'}</div>
                      <div style={{ fontSize: 13, color: 'var(--ink-light)', marginBottom: 12 }}>{currentMember?.discipline || '—'}</div>
                      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 5 }}>Currently Building</div>
                      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontStyle: 'italic', color: 'var(--ink-mid)', lineHeight: 1.4 }}>{currentMember?.building_full || '—'}</div>
                    </div>
                  </div>
                  <div style={{ padding: 32, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32 }}>
                    {[
                      { label: 'Member Since', value: currentMember?.member_since, sub: 'Season 1 · ' + (currentMember?.tier || 'Member') },
                      { label: 'Industry', value: currentMember?.industry },
                      { label: 'Location', value: currentMember?.location }
                    ].map((s, i) => (
                      <div key={i}>
                        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 10 }}>{s.label}</div>
                        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, color: 'var(--ink)' }}>{s.value || '—'}</div>
                        {s.sub && <div style={{ fontSize: 11, color: 'var(--ink-light)', marginTop: 3 }}>{s.sub}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activePage === 'submit' && (
              <div>
                <div style={{ marginBottom: 48 }}>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C8813A', marginBottom: 10 }}>Your Submissions</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 32, fontWeight: 300, color: 'var(--ink)', marginBottom: 16 }}><em style={{ fontStyle: 'italic' }}>Submit</em> Files</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-light)', maxWidth: 520, lineHeight: 1.7 }}>Upload files requested by your Charlie Mulan team.</div>
                </div>
                <div style={{ border: '1px solid var(--rule)', background: 'var(--paper)' }}>
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--rule)' }}>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mid)' }}>Upload a File</span>
                  </div>
                  <div style={{ padding: 24 }}>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 8 }}>File Description</label>
                      <input value={uploadDesc} onChange={e => setUploadDesc(e.target.value)} style={{ width: '100%', background: 'var(--paper-dark)', border: '1px solid var(--rule)', color: 'var(--ink)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 300, padding: '10px 14px', outline: 'none' }} placeholder="e.g. Brand photos" />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 8 }}>Notes (optional)</label>
                      <textarea value={uploadNotes} onChange={e => setUploadNotes(e.target.value)} style={{ width: '100%', background: 'var(--paper-dark)', border: '1px solid var(--rule)', color: 'var(--ink)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 300, padding: '10px 14px', outline: 'none', minHeight: 80, resize: 'vertical' }} placeholder="Any context..." />
                    </div>
                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
                    <div onClick={() => fileInputRef.current?.click()} style={{ border: '1px dashed rgba(200,129,58,0.3)', padding: 32, textAlign: 'center', cursor: 'pointer' }}>
                      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, color: 'var(--ink)', marginBottom: 6 }}>Drop a file or click to browse</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-light)', marginBottom: 16 }}>PDF, DOC, JPG, PNG — max 50MB</div>
                      <div style={{ display: 'inline-block', fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', background: '#C8813A', color: '#1A1612', padding: '10px 20px', fontWeight: 500 }}>Choose File</div>
                    </div>
                    {uploadStatus === 'uploading' && <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--ink-light)', marginTop: 12 }}>Uploading...</div>}
                    {uploadStatus === 'success' && <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, padding: '10px 14px', marginTop: 12, background: 'rgba(123,174,127,0.1)', color: '#4a8a4f', border: '1px solid rgba(123,174,127,0.3)' }}>Uploaded successfully.</div>}
                    {uploadStatus === 'error' && <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, padding: '10px 14px', marginTop: 12, background: 'rgba(192,57,43,0.1)', color: '#C0392B', border: '1px solid rgba(192,57,43,0.3)' }}>Upload failed. Please try again.</div>}
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {activeMessage && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,22,18,0.8)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setActiveMessage(null)}>
          <div style={{ background: 'var(--paper)', width: 560, maxWidth: '95vw', border: '1px solid var(--rule)' }} onClick={e => e.stopPropagation()}>
            <div style={{ background: 'var(--ink)', padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C8813A', marginBottom: 4 }}>Message</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, color: '#F5F0E8' }}>{activeMessage.sender_name}</div>
              </div>
              <button onClick={() => setActiveMessage(null)} style={{ width: 32, height: 32, border: '1px solid rgba(245,240,232,0.2)', background: 'transparent', color: 'rgba(245,240,232,0.6)', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ padding: 32 }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 17, color: 'var(--ink)', lineHeight: 1.6, marginBottom: 24 }}>{activeMessage.body}</div>
              <a href={`mailto:hello@iamthecreativejuice.com?subject=Re: ${activeMessage.sender_name}`} style={{ display: 'inline-block', background: '#C8813A', color: '#1A1612', fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '10px 20px', textDecoration: 'none', fontWeight: 500 }}>Reply by Email →</a>
            </div>
          </div>
        </div>
      )}

      {showAdmin && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,22,18,0.85)', zIndex: 500, overflowY: 'auto' }}>
          <div style={{ background: 'var(--paper)', width: 720, maxWidth: '95vw', margin: '40px auto', border: '1px solid var(--rule)' }}>
            <div style={{ background: 'var(--ink)', padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C8813A', marginBottom: 4 }}>Charlie Mulan · Admin</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, color: '#F5F0E8' }}>Portal Management</div>
              </div>
              <button onClick={() => setShowAdmin(false)} style={{ width: 36, height: 36, border: '1px solid rgba(245,240,232,0.2)', background: 'transparent', color: 'rgba(245,240,232,0.6)', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ padding: '20px 32px', borderBottom: '1px solid var(--rule)' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 10 }}>Viewing Member</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                {allMembers.map(m => (
                  <button key={m.id} onClick={() => { switchMember(m); loadAdminData(m.id) }} style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '8px 16px', border: currentMember?.id === m.id ? '1px solid #C8813A' : '1px solid var(--rule)', background: currentMember?.id === m.id ? 'rgba(200,129,58,0.08)' : 'transparent', color: currentMember?.id === m.id ? '#C8813A' : 'var(--ink-light)', cursor: 'pointer' }}>{m.name}{m.brand ? ' · ' + m.brand : ''}</button>
                ))}
                <button onClick={() => setShowAddMember(true)} style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C8813A', background: 'transparent', border: '1px dashed rgba(200,129,58,0.4)', padding: '6px 14px', cursor: 'pointer' }}>+ Add Member</button>
              </div>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--rule)', padding: '0 32px', overflowX: 'auto' }}>
              {['member', 'session', 'deliverables', 'opportunities', 'messages', 'requests'].map(t => (
                <div key={t} onClick={() => setAdminTab(t)} style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: adminTab === t ? 'var(--ink)' : 'var(--ink-light)', padding: '14px 0', marginRight: 28, cursor: 'pointer', borderBottom: adminTab === t ? '2px solid #C8813A' : '2px solid transparent', whiteSpace: 'nowrap' }}>{t === 'member' ? 'Member Info' : t.charAt(0).toUpperCase() + t.slice(1)}</div>
              ))}
            </div>
            <div style={{ padding: 32 }}>
              {adminTab === 'member' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <FormField label="Full Name" value={aForm.name || ''} onChange={v => setAForm(f => ({ ...f, name: v }))} />
                    <FormField label="Email" value={aForm.email || ''} onChange={v => setAForm(f => ({ ...f, email: v }))} />
                  </div>
                  <FormField label="Brand / Company" value={aForm.brand || ''} onChange={v => setAForm(f => ({ ...f, brand: v }))} style={{ marginBottom: 16 }} />
                  <FormField label="Building (sidebar)" value={aForm.building_short || ''} onChange={v => setAForm(f => ({ ...f, building_short: v }))} style={{ marginBottom: 16 }} />
                  <FormField label="Currently Building (full)" value={aForm.building_full || ''} onChange={v => setAForm(f => ({ ...f, building_full: v }))} textarea style={{ marginBottom: 16 }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <FormField label="Discipline" value={aForm.discipline || ''} onChange={v => setAForm(f => ({ ...f, discipline: v }))} />
                    <FormField label="Industry" value={aForm.industry || ''} onChange={v => setAForm(f => ({ ...f, industry: v }))} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <FormField label="Location" value={aForm.location || ''} onChange={v => setAForm(f => ({ ...f, location: v }))} />
                    <FormField label="Member Since" value={aForm.member_since || ''} onChange={v => setAForm(f => ({ ...f, member_since: v }))} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <FormField label="Tier" value={aForm.tier || ''} onChange={v => setAForm(f => ({ ...f, tier: v }))} />
                    <FormField label="Sessions Completed" value={aForm.sessions_completed || ''} onChange={v => setAForm(f => ({ ...f, sessions_completed: v }))} type="number" />
                    <FormField label="Retainer" value={aForm.retainer || ''} onChange={v => setAForm(f => ({ ...f, retainer: v }))} />
                  </div>
                  <button onClick={saveMemberInfo} style={{ background: '#C8813A', color: '#1A1612', fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500, padding: '12px 24px', border: 'none', cursor: 'pointer' }}>Save All Changes</button>
                  <StatusMsg id="member" />
                </div>
              )}
              {adminTab === 'session' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <FormField label="Session Title" value={aForm.session_title || ''} onChange={v => setAForm(f => ({ ...f, session_title: v }))} />
                    <FormField label="Session Short (sidebar)" value={aForm.session_short || ''} onChange={v => setAForm(f => ({ ...f, session_short: v }))} />
                  </div>
                  <FormField label="Session Date Display" value={aForm.session_date || ''} onChange={v => setAForm(f => ({ ...f, session_date: v }))} style={{ marginBottom: 16 }} />
                  <FormField label="Session Prep Note" value={aForm.session_prep || ''} onChange={v => setAForm(f => ({ ...f, session_prep: v }))} textarea style={{ marginBottom: 16 }} />
                  <button onClick={saveMemberInfo} style={{ background: '#C8813A', color: '#1A1612', fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500, padding: '12px 24px', border: 'none', cursor: 'pointer' }}>Save Session Info</button>
                  <StatusMsg id="member" />
                </div>
              )}
              {adminTab === 'deliverables' && (
                <div>
                  {adminDeliverables.map(d => (
                    <div key={d.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--rule)', gap: 12 }}>
                      <div>
                        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 15, color: 'var(--ink)', marginBottom: 3 }}>{d.title}</div>
                        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--ink-light)' }}>{d.file_type} · {d.category} · {d.display_date}{d.is_new ? ' · NEW' : ''}</div>
                      </div>
                      <button onClick={() => deleteItem('deliverables', d.id)} style={{ background: 'transparent', color: '#C0392B', fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 12px', border: '1px solid rgba(192,57,43,0.3)', cursor: 'pointer', flexShrink: 0 }}>Remove</button>
                    </div>
                  ))}
                  <div onClick={() => setShowAddDel(!showAddDel)} style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C8813A', cursor: 'pointer', border: '1px dashed rgba(200,129,58,0.4)', padding: '12px 20px', textAlign: 'center', marginTop: 16, display: 'block' }}>+ Add New Deliverable</div>
                  {showAddDel && (
                    <div style={{ background: 'var(--paper-dark)', border: '1px solid var(--rule)', padding: 24, marginTop: 12 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <FormField label="Title" value={newDel.title || ''} onChange={v => setNewDel(f => ({ ...f, title: v }))} />
                        <FormField label="Type" value={newDel.file_type || ''} onChange={v => setNewDel(f => ({ ...f, file_type: v }))} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <FormField label="Category" value={newDel.category || ''} onChange={v => setNewDel(f => ({ ...f, category: v }))} />
                        <FormField label="Display Date" value={newDel.display_date || ''} onChange={v => setNewDel(f => ({ ...f, display_date: v }))} />
                      </div>
                      <FormField label="Google Drive Link" value={newDel.file_url || ''} onChange={v => setNewDel(f => ({ ...f, file_url: v }))} style={{ marginBottom: 12 }} />
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 16, cursor: 'pointer' }}>
                        <input type="checkbox" checked={newDel.is_new || false} onChange={e => setNewDel(f => ({ ...f, is_new: e.target.checked }))} /> Mark as New
                      </label>
                      <button onClick={addDeliverable} style={{ background: '#C8813A', color: '#1A1612', fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500, padding: '12px 24px', border: 'none', cursor: 'pointer' }}>Add Deliverable</button>
                      <StatusMsg id="del" />
                    </div>
                  )}
                </div>
              )}
              {adminTab === 'opportunities' && (
                <div>
                  {adminOpportunities.map(o => (
                    <div key={o.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--rule)', gap: 12 }}>
                      <div>
                        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 15, color: 'var(--ink)', marginBottom: 3 }}>{o.title}</div>
                        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--ink-light)' }}>{o.tag}</div>
                      </div>
                      <button onClick={() => deleteItem('opportunities', o.id)} style={{ background: 'transparent', color: '#C0392B', fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 12px', border: '1px solid rgba(192,57,43,0.3)', cursor: 'pointer', flexShrink: 0 }}>Remove</button>
                    </div>
                  ))}
                  <div onClick={() => setShowAddOpp(!showAddOpp)} style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C8813A', cursor: 'pointer', border: '1px dashed rgba(200,129,58,0.4)', padding: '12px 20px', textAlign: 'center', marginTop: 16, display: 'block' }}>+ Add New Opportunity</div>
                  {showAddOpp && (
                    <div style={{ background: 'var(--paper-dark)', border: '1px solid var(--rule)', padding: 24, marginTop: 12 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <FormField label="Title" value={newOpp.title || ''} onChange={v => setNewOpp(f => ({ ...f, title: v }))} />
                        <FormField label="Tag" value={newOpp.tag || ''} onChange={v => setNewOpp(f => ({ ...f, tag: v }))} placeholder="Grant · Wellness" />
                      </div>
                      <FormField label="Detail" value={newOpp.detail || ''} onChange={v => setNewOpp(f => ({ ...f, detail: v }))} textarea style={{ marginBottom: 16 }} />
                      <button onClick={addOpportunity} style={{ background: '#C8813A', color: '#1A1612', fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500, padding: '12px 24px', border: 'none', cursor: 'pointer' }}>Add Opportunity</button>
                      <StatusMsg id="opp" />
                    </div>
                  )}
                </div>
              )}
              {adminTab === 'messages' && (
                <div>
                  {adminMessages.map(m => (
                    <div key={m.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--rule)', gap: 12 }}>
                      <div>
                        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 15, color: 'var(--ink)', marginBottom: 3 }}>{m.sender_name}</div>
                        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--ink-light)' }}>{(m.body || '').substring(0, 80)}{m.body?.length > 80 ? '...' : ''}</div>
                      </div>
                      <button onClick={() => deleteItem('messages', m.id)} style={{ background: 'transparent', color: '#C0392B', fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 12px', border: '1px solid rgba(192,57,43,0.3)', cursor: 'pointer', flexShrink: 0 }}>Remove</button>
                    </div>
                  ))}
                  <div onClick={() => setShowAddMsg(!showAddMsg)} style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C8813A', cursor: 'pointer', border: '1px dashed rgba(200,129,58,0.4)', padding: '12px 20px', textAlign: 'center', marginTop: 16, display: 'block' }}>+ Add New Message</div>
                  {showAddMsg && (
                    <div style={{ background: 'var(--paper-dark)', border: '1px solid var(--rule)', padding: 24, marginTop: 12 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <FormField label="Sender Name" value={newMsg.sender_name || ''} onChange={v => setNewMsg(f => ({ ...f, sender_name: v }))} placeholder="Charlie Mulan · Agency" />
                        <FormField label="Sender Initial(s)" value={newMsg.sender_initial || ''} onChange={v => setNewMsg(f => ({ ...f, sender_initial: v }))} placeholder="CM" />
                      </div>
                      <FormField label="Message" value={newMsg.body || ''} onChange={v => setNewMsg(f => ({ ...f, body: v }))} textarea style={{ marginBottom: 16 }} />
                      <FormField label="Time Display" value={newMsg.time_display || ''} onChange={v => setNewMsg(f => ({ ...f, time_display: v }))} placeholder="May 7" style={{ marginBottom: 16 }} />
                      <button onClick={addMessage} style={{ background: '#C8813A', color: '#1A1612', fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500, padding: '12px 24px', border: 'none', cursor: 'pointer' }}>Add Message</button>
                      <StatusMsg id="msg" />
                    </div>
                  )}
                </div>
              )}
              {adminTab === 'requests' && (
                <div>
                  {adminRequests.map(r => (
                    <div key={r.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--rule)', gap: 12 }}>
                      <div>
                        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 15, color: 'var(--ink)', marginBottom: 3 }}>{r.title}</div>
                        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--ink-light)' }}>Status: {r.status}</div>
                      </div>
                      <button onClick={() => deleteItem('file_requests', r.id)} style={{ background: 'transparent', color: '#C0392B', fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 12px', border: '1px solid rgba(192,57,43,0.3)', cursor: 'pointer', flexShrink: 0 }}>Remove</button>
                    </div>
                  ))}
                  <div onClick={() => setShowAddReq(!showAddReq)} style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C8813A', cursor: 'pointer', border: '1px dashed rgba(200,129,58,0.4)', padding: '12px 20px', textAlign: 'center', marginTop: 16, display: 'block' }}>+ Send File Request</div>
                  {showAddReq && (
                    <div style={{ background: 'var(--paper-dark)', border: '1px solid var(--rule)', padding: 24, marginTop: 12 }}>
                      <FormField label="Request Title" value={newReq.title || ''} onChange={v => setNewReq(f => ({ ...f, title: v }))} style={{ marginBottom: 16 }} />
                      <FormField label="Instructions for Member" value={newReq.detail || ''} onChange={v => setNewReq(f => ({ ...f, detail: v }))} textarea style={{ marginBottom: 16 }} />
                      <button onClick={addRequest} style={{ background: '#C8813A', color: '#1A1612', fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500, padding: '12px 24px', border: 'none', cursor: 'pointer' }}>Send Request</button>
                      <StatusMsg id="req" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showAddMember && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,22,18,0.9)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--paper)', width: 600, maxWidth: '95vw', border: '1px solid var(--rule)', padding: 40 }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, color: 'var(--ink)', marginBottom: 24 }}>Add New Member</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <FormField label="Full Name" value={newMem.name || ''} onChange={v => setNewMem(f => ({ ...f, name: v }))} />
              <FormField label="Email" value={newMem.email || ''} onChange={v => setNewMem(f => ({ ...f, email: v }))} />
            </div>
            <FormField label="Temporary Password" value={newMem.password || ''} onChange={v => setNewMem(f => ({ ...f, password: v }))} style={{ marginBottom: 16 }} />
            <FormField label="Brand / Company" value={newMem.brand || ''} onChange={v => setNewMem(f => ({ ...f, brand: v }))} style={{ marginBottom: 16 }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <FormField label="Industry" value={newMem.industry || ''} onChange={v => setNewMem(f => ({ ...f, industry: v }))} />
              <FormField label="Location" value={newMem.location || ''} onChange={v => setNewMem(f => ({ ...f, location: v }))} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={createMember} style={{ background: '#C8813A', color: '#1A1612', fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500, padding: '12px 24px', border: 'none', cursor: 'pointer' }}>Create Member</button>
              <button onClick={() => setShowAddMember(false)} style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '12px 20px', border: '1px solid var(--rule)', background: 'transparent', color: 'var(--ink-light)', cursor: 'pointer' }}>Cancel</button>
            </div>
            <StatusMsg id="newmem" />
          </div>
        </div>
      )}
    </>
  )
}

function NavItem({ label, active, onClick, badge }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 28px', cursor: 'pointer', background: active ? 'rgba(200,129,58,0.1)' : 'transparent', borderLeft: active ? '2px solid #C8813A' : '2px solid transparent' }}>
      <span style={{ fontSize: 11, color: active ? '#F5F0E8' : 'rgba(245,240,232,0.5)', flex: 1, fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>{label}</span>
      {badge && <span style={{ background: '#C8813A', color: '#1A1612', fontFamily: 'DM Mono, monospace', fontSize: 8, fontWeight: 500, padding: '2px 6px', borderRadius: 2 }}>{badge}</span>}
    </div>
  )
}

function DeliverableRow({ d }) {
  const content = (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--rule)' }}>
      <div style={{ width: 36, height: 36, background: d.is_new ? 'rgba(200,129,58,0.08)' : 'var(--paper-dark)', border: `1px solid ${d.is_new ? 'rgba(200,129,58,0.25)' : 'var(--rule)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'DM Mono, monospace', fontSize: 8, color: d.is_new ? '#C8813A' : 'var(--ink-light)' }}>{d.file_type || 'DOC'}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 15, color: 'var(--ink)', marginBottom: 3 }}>{d.title}</div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--ink-light)', letterSpacing: '0.08em' }}>{d.category} · Uploaded {d.display_date}</div>
      </div>
      {d.is_new && <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C8813A', border: '1px solid rgba(200,129,58,0.3)', padding: '2px 7px', alignSelf: 'center' }}>New</div>}
    </div>
  )
  return d.file_url ? <a href={d.file_url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>{content}</a> : content
}

function OppRow({ o }) {
  return (
    <div style={{ padding: '16px 0', borderBottom: '1px solid var(--rule)' }}>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C8813A', marginBottom: 6 }}>{o.tag}</div>
      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 15, color: 'var(--ink)', marginBottom: 4, lineHeight: 1.3 }}>{o.title}</div>
      <div style={{ fontSize: 11, color: 'var(--ink-light)', lineHeight: 1.5 }}>{o.detail}</div>
    </div>
  )
}

function MessageRow({ m, i, onClick }) {
  const colors = ['#C8813A', '#D4C5B0', '#B5C9C0', '#C4B5A0', '#A0B5C4']
  return (
    <div onClick={onClick} style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--rule)', cursor: 'pointer' }}>
      <div style={{ width: 30, height: 30, borderRadius: '50%', background: colors[i % colors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: 12, fontWeight: 500, color: 'var(--ink)', flexShrink: 0, marginTop: 2 }}>{m.sender_initial || '?'}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.08em', color: 'var(--ink-mid)', marginBottom: 3 }}>{m.sender_name}</div>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 14, color: 'var(--ink)', lineHeight: 1.4 }}>{m.body}</div>
      </div>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, color: 'var(--ink-light)', flexShrink: 0, marginTop: 4 }}>{m.time_display}</div>
    </div>
  )
}

function FormField({ label, value, onChange, textarea, type, placeholder, style: s }) {
  const base = { width: '100%', background: 'var(--paper-dark)', border: '1px solid var(--rule)', color: 'var(--ink)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 300, padding: '10px 14px', outline: 'none', resize: textarea ? 'vertical' : undefined, minHeight: textarea ? 80 : undefined }
  return (
    <div style={{ marginBottom: s?.marginBottom || 0, ...s }}>
      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 8 }}>{label}</label>
      {textarea ? <textarea value={value} onChange={e => onChange(e.target.value)} style={base} placeholder={placeholder} /> : <input type={type || 'text'} value={value} onChange={e => onChange(e.target.value)} style={base} placeholder={placeholder} />}
    </div>
  )
}

function pageTitle(page) {
  return { home: 'Member Home', 'admin-home': 'Admin Dashboard', deliverables: 'My Deliverables', opportunities: 'Opportunities', community: 'The Room', messages: 'Messages', profile: 'My Profile', submit: 'Submit Files' }[page] || ''
}
