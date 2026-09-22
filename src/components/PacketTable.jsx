// // import { useState, useMemo } from 'react'
// // import { formatTimestamp, decodeSmsContent } from '../utils/api'
// // import Pagination from './Pagination'

// // const PacketTable = ({ packets, itemsPerPage = 50 }) => {
// //   const [currentPage, setCurrentPage] = useState(1)
// //   const [expandedRows, setExpandedRows] = useState(new Set())

// //   // Calculate pagination
// //   const totalItems = packets.length
// //   const totalPages = Math.ceil(totalItems / itemsPerPage)
// //   const startIndex = (currentPage - 1) * itemsPerPage
// //   const endIndex = startIndex + itemsPerPage
// //   const currentPackets = packets.slice(startIndex, endIndex)

// //   const toggleRowExpansion = (packetIndex) => {
// //     const newExpanded = new Set(expandedRows)
// //     const globalIndex = startIndex + packetIndex
    
// //     if (newExpanded.has(globalIndex)) {
// //       newExpanded.delete(globalIndex)
// //     } else {
// //       newExpanded.add(globalIndex)
// //     }
// //     setExpandedRows(newExpanded)
// //   }

// //   const isRowExpanded = (packetIndex) => {
// //     const globalIndex = startIndex + packetIndex
// //     return expandedRows.has(globalIndex)
// //   }

// //   // Get protocol-specific badge color
// //   const getProtocolBadgeColor = (protocol) => {
// //     const colors = {
// //       'GSM SMS': 'bg-green-100 text-green-800',
// //       'SMPP': 'bg-blue-100 text-blue-800',
// //       'SCTP': 'bg-purple-100 text-purple-800',
// //       'TCP': 'bg-gray-100 text-gray-800',
// //       'UDP': 'bg-yellow-100 text-yellow-800',
// //       default: 'bg-gray-100 text-gray-800'
// //     }
// //     return colors[protocol] || colors.default
// //   }

// //   // Render SMS content for GSM SMS packets
// //   const renderSmsContent = (packet) => {
// //     if (packet.protocol === 'GSM SMS' && packet.sms_content) {
// //       const decodedContent = decodeSmsContent(packet.sms_content)
// //       return (
// //         <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
// //           <h5 className="text-sm font-medium text-green-800 mb-1">SMS Content:</h5>
// //           <p className="text-sm text-green-700 font-mono break-all">{decodedContent}</p>
// //           <div className="mt-2 text-xs text-green-600">
// //             <p>Length: {packet.sms_length} bytes</p>
// //             <p>Message Type: {packet.sms_message_type}</p>
// //             <p>PDU Type: {packet.sms_pdu_type}</p>
// //           </div>
// //         </div>
// //       )
// //     }
// //     return null
// //   }

// //   // Render additional packet details
// //   const renderPacketDetails = (packet) => {
// //     const details = []
    
// //     // Basic network info
// //     details.push(
// //       <div key="network" className="grid grid-cols-2 gap-4">
// //         <div>
// //           <h5 className="text-sm font-medium text-gray-700 mb-2">Network Information</h5>
// //           <div className="space-y-1 text-sm">
// //             <p><span className="text-gray-500">IP Version:</span> {packet.ip_version}</p>
// //             <p><span className="text-gray-500">Protocol Number:</span> {packet.protocol_num}</p>
// //             <p><span className="text-gray-500">TTL:</span> {packet.ttl}</p>
// //             <p><span className="text-gray-500">Payload Size:</span> {packet.payload_size} bytes</p>
// //           </div>
// //         </div>
        
// //         {packet.protocol === 'TCP' && (
// //           <div>
// //             <h5 className="text-sm font-medium text-gray-700 mb-2">TCP Information</h5>
// //             <div className="space-y-1 text-sm">
// //               <p><span className="text-gray-500">Sequence:</span> {packet.seq_num}</p>
// //               <p><span className="text-gray-500">ACK:</span> {packet.ack_num}</p>
// //               <p><span className="text-gray-500">Window Size:</span> {packet.window_size}</p>
// //               <p><span className="text-gray-500">Flags:</span> {packet.tcp_flags_names?.join(', ') || 'N/A'}</p>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     )

// //     // SMPP specific info
// //     if (packet.smpp_command_id) {
// //       details.push(
// //         <div key="smpp" className="border-t pt-4">
// //           <h5 className="text-sm font-medium text-gray-700 mb-2">SMPP Information</h5>
// //           <div className="grid grid-cols-2 gap-4 text-sm">
// //             <div>
// //               <p><span className="text-gray-500">Command:</span> {packet.smpp_command_name}</p>
// //               <p><span className="text-gray-500">Command ID:</span> {packet.smpp_command_id}</p>
// //             </div>
// //             <div>
// //               <p><span className="text-gray-500">Status:</span> {packet.smpp_command_status}</p>
// //               <p><span className="text-gray-500">Sequence:</span> {packet.smpp_sequence}</p>
// //             </div>
// //           </div>
// //         </div>
// //       )
// //     }

// //     // Payload hex dump (truncated)
// //     if (packet.payload_hex) {
// //       const truncatedHex = packet.payload_hex.substring(0, 200)
// //       details.push(
// //         <div key="payload" className="border-t pt-4">
// //           <h5 className="text-sm font-medium text-gray-700 mb-2">Payload (Hex)</h5>
// //           <div className="bg-gray-100 p-3 rounded font-mono text-xs break-all">
// //             {truncatedHex}
// //             {packet.payload_hex.length > 200 && (
// //               <span className="text-gray-500">... ({packet.payload_hex.length - 200} more chars)</span>
// //             )}
// //           </div>
// //         </div>
// //       )
// //     }

// //     return details
// //   }

// //   if (!packets || packets.length === 0) {
// //     return (
// //       <div className="card text-center py-12">
// //         <div className="text-gray-400 mb-4">
// //           <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
// //           </svg>
// //         </div>
// //         <h3 className="text-lg font-medium text-gray-900 mb-2">No Packets Found</h3>
// //         <p className="text-gray-500">No packets available to display.</p>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="card p-0 overflow-hidden">
// //       <div className="px-6 py-4 border-b border-gray-200">
// //         <h3 className="text-lg font-semibold text-gray-900">
// //           Packet Analysis ({totalItems} packets)
// //         </h3>
// //       </div>

// //       <div className="overflow-x-auto">
// //         <table className="min-w-full divide-y divide-gray-200">
// //           <thead className="bg-gray-50">
// //             <tr>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Index
// //               </th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Timestamp
// //               </th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Protocol
// //               </th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Source
// //               </th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Destination
// //               </th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Length
// //               </th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Actions
// //               </th>
// //             </tr>
// //           </thead>
// //           <tbody className="bg-white divide-y divide-gray-200">
// //             {currentPackets.map((packet, index) => (
// //               <React.Fragment key={`${packet.index}-${index}`}>
// //                 <tr className={`hover:bg-gray-50 ${isRowExpanded(index) ? 'bg-blue-50' : ''}`}>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
// //                     #{packet.index}
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                     {formatTimestamp(packet.timestamp)}
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getProtocolBadgeColor(packet.protocol)}`}>
// //                       {packet.protocol}
// //                     </span>
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                     {packet.src_ip}:{packet.src_port}
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                     {packet.dst_ip}:{packet.dst_port}
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                     {packet.length} bytes
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                     <button
// //                       onClick={() => toggleRowExpansion(index)}
// //                       className="text-primary-600 hover:text-primary-800 font-medium"
// //                     >
// //                       {isRowExpanded(index) ? 'Hide Details' : 'Show Details'}
// //                     </button>
// //                   </td>
// //                 </tr>

// //                 {isRowExpanded(index) && (
// //                   <tr>
// //                     <td colSpan="7" className="px-6 py-4 bg-gray-50">
// //                       <div className="space-y-4">
// //                         {renderSmsContent(packet)}
// //                         <div className="space-y-4">
// //                           {renderPacketDetails(packet)}
// //                         </div>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 )}
// //               </React.Fragment>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>

// //       <Pagination
// //         currentPage={currentPage}
// //         totalPages={totalPages}
// //         totalItems={totalItems}
// //         itemsPerPage={itemsPerPage}
// //         onPageChange={setCurrentPage}
// //       />
// //     </div>
// //   )
// // }

// // export default PacketTable

// import React, { useState, useMemo } from 'react';
// import { formatTimestamp, decodeSmsContent } from '../utils/api';
// import Pagination from './Pagination';

// const PacketTable = ({ packets, itemsPerPage = 50 }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [expandedRows, setExpandedRows] = useState(new Set());

//   // Calculate pagination
//   const totalItems = packets.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentPackets = packets.slice(startIndex, endIndex);

//   const toggleRowExpansion = (packetIndex) => {
//     const newExpanded = new Set(expandedRows);
//     const globalIndex = startIndex + packetIndex;

//     if (newExpanded.has(globalIndex)) {
//       newExpanded.delete(globalIndex);
//     } else {
//       newExpanded.add(globalIndex);
//     }
//     setExpandedRows(newExpanded);
//   };

//   const isRowExpanded = (packetIndex) => {
//     const globalIndex = startIndex + packetIndex;
//     return expandedRows.has(globalIndex);
//   };

//   // Get protocol-specific badge color
//   const getProtocolBadgeColor = (protocol) => {
//     const colors = {
//       'GSM SMS': 'bg-green-100 text-green-800',
//       'SMPP': 'bg-blue-100 text-blue-800',
//       'SCTP': 'bg-purple-100 text-purple-800',
//       'TCP': 'bg-gray-100 text-gray-800',
//       'UDP': 'bg-yellow-100 text-yellow-800',
//       default: 'bg-gray-100 text-gray-800',
//     };
//     return colors[protocol] || colors.default;
//   };

//   // Render SMS content for GSM SMS packets
//   const renderSmsContent = (packet) => {
//     if (packet.protocol === 'GSM SMS' && packet.sms_content) {
//       const decodedContent = decodeSmsContent(packet.sms_content);
//       return (
//         <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
//           <h5 className="text-sm font-medium text-green-800 mb-1">SMS Content:</h5>
//           {/* <p className="text-sm text-green-700 font-mono break-all">{decoded Ліцензія на використання контенту}</p> */}
//           <div className="mt-2 text-xs text-green-600">
//             <p>Length: {packet.sms_length} bytes</p>
//             <p>Message Type: {packet.sms_message_type}</p>
//             <p>PDU Type: {packet.sms_pdu_type}</p>
//           </div>
//         </div>
//       );
//     }
//     return null;
//   };

//   // Render additional packet details
//   const renderPacketDetails = (packet) => {
//     const details = [];

//     // Basic network info
//     details.push(
//       <div key="network" className="grid grid-cols-2 gap-4">
//         <div>
//           <h5 className="text-sm font-medium text-gray-700 mb-2">Network Information</h5>
//           <div className="space-y-1 text-sm">
//             <p><span className="text-gray-500">IP Version:</span> {packet.ip_version}</p>
//             <p><span className="text-gray-500">Protocol Number:</span> {packet.protocol_num}</p>
//             <p><span className="text-gray-500">TTL:</span> {packet.ttl}</p>
//             <p><span className="text-gray-500">Payload Size:</span> {packet.payload_size} bytes</p>
//           </div>
//         </div>

//         {packet.protocol === 'TCP' && (
//           <div>
//             <h5 className="text-sm font-medium text施治 text-gray-700 mb-2">TCP Information</h5>
//             <div className="space-y-1 text-sm">
//               <p><span className="text-gray-500">Sequence:</span> {packet.seq_num}</p>
//               <p><span className="text-gray-500">ACK:</span> {packet.ack_num}</p>
//               <p><span className="text-gray-500">Window Size:</span> {packet.window_size}</p>
//               <p><span className="text-gray-500">Flags:</span> {packet.tcp_flags_names?.join(', ') || 'N/A'}</p>
//             </div>
//           </div>
//         )}
//       </div>
//     );

//     // SMPP specific info
//     if (packet.smpp_command_id) {
//       details.push(
//         <div key="smpp" className="border-t pt-4">
//           <h5 className="text-sm font-medium text-gray-700 mb-2">SMPP Information</h5>
//           <div className="grid grid-cols-2 gap-4 text-sm">
//             <div>
//               <p><span className="text-gray-500">Command:</span> {packet.smpp_command_name}</p>
//               <p><span className="text-gray-500">Command ID:</span> {packet.smpp_command_id}</p>
//             </div>
//             <div>
//               <p><span className="text-gray-500">Status:</span> {packet.smpp_command_status}</p>
//               <p><span className="text-gray-500">Sequence:</span> {packet.smpp_sequence}</p>
//             </div>
//           </div>
//         </div>
//       );
//     }

//     // Payload hex dump (truncated)
//     if (packet.payload_hex) {
//       const truncatedHex = packet.payload_hex.substring(0, 200);
//       details.push(
//         <div key="payload" className="border-t pt-4">
//           <h5 className="text-sm font-medium text-gray-700 mb-2">Payload (Hex)</h5>
//           <div className="bg-gray-100 p-3 rounded font-mono text-xs break-all">
//             {truncatedHex}
//             {packet.payload_hex.length > 200 && (
//               <span className="text-gray-500">... ({packet.payload_hex.length - 200} more chars)</span>
//             )}
//           </div>
//         </div>
//       );
//     }

//     return details;
//   };

//   if (!packets || packets.length === 0) {
//     return (
//       <div className="card text-center py-12">
//         <div className="text-gray-400 mb-4">
//           <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//           </svg>
//         </div>
//         <h3 className="text-lg font-medium text-gray-900 mb-2">No Packets Found</h3>
//         <p className="text-gray-500">No packets available to display.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="card p-0 overflow-hidden">
//       <div className="px-6 py-4 border-b border-gray-200">
//         <h3 className="text-lg font-semibold text-gray-900">
//           Packet Analysis ({totalItems} packets)
//         </h3>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Index
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Timestamp
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Protocol
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Source
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Destination
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Length
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {currentPackets.map((packet, index) => (
//               <React.Fragment key={`${packet.index}-${index}`}>
//                 <tr className={`hover:bg-gray-50 ${isRowExpanded(index) ? 'bg-blue-50' : ''}`}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     #{packet.index}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {formatTimestamp(packet.timestamp)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getProtocolBadgeColor(packet.protocol)}`}>
//                       {packet.protocol}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {packet.src_ip}:{packet.src_port}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {packet.dst_ip}:{packet.dst_port}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {packet.length} bytes
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <button
//                       onClick={() => toggleRowExpansion(index)}
//                       className="text-primary-600 hover:text-primary-800 font-medium"
//                     >
//                       {isRowExpanded(index) ? 'Hide Details' : 'Show Details'}
//                     </button>
//                   </td>
//                 </tr>

//                 {isRowExpanded(index) && (
//                   <tr>
//                     <td colSpan="7" className="px-6 py-4 bg-gray-50">
//                       <div className="space-y-4">
//                         {renderSmsContent(packet)}
//                         <div className="space-y-4">
//                           {renderPacketDetails(packet)}
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         totalItems={totalItems}
//         itemsPerPage={itemsPerPage}
//         onPageChange={setCurrentPage}
//       />
//     </div>
//   );
// };

// export default PacketTable;

import { useState, useMemo } from 'react'

const PacketTable = ({ packets = [], itemsPerPage = 50 }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPacket, setSelectedPacket] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [filterProtocol, setFilterProtocol] = useState('ALL')
  const [sortField, setSortField] = useState('index')
  const [sortDirection, setSortDirection] = useState('asc')

  // Get unique protocols for filter
  const protocols = useMemo(() => {
    const uniqueProtocols = [...new Set(packets.map(p => p.protocol).filter(Boolean))]
    return uniqueProtocols.sort()
  }, [packets])

  // Filter and sort packets
  const filteredAndSortedPackets = useMemo(() => {
    let filtered = packets
    
    if (filterProtocol !== 'ALL') {
      filtered = packets.filter(p => p.protocol === filterProtocol)
    }

    return filtered.sort((a, b) => {
      const aVal = a[sortField] || ''
      const bVal = b[sortField] || ''
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
      }
      
      const aStr = String(aVal).toLowerCase()
      const bStr = String(bVal).toLowerCase()
      
      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr)
      }
      return bStr.localeCompare(aStr)
    })
  }, [packets, filterProtocol, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedPackets.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPackets = filteredAndSortedPackets.slice(startIndex, endIndex)

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handlePacketClick = (packet) => {
    setSelectedPacket(packet)
    setShowModal(true)
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A'
    return new Date(timestamp * 1000).toLocaleString()
  }

  const getProtocolBadgeColor = (protocol) => {
    const colors = {
      'GSM SMS': 'bg-green-100 text-green-800',
      'SMS-SUBMIT': 'bg-blue-100 text-blue-800',
      'SMS-DELIVER': 'bg-purple-100 text-purple-800',
      'SMPP': 'bg-orange-100 text-orange-800',
      'TCP': 'bg-gray-100 text-gray-800',
      'UDP': 'bg-cyan-100 text-cyan-800',
      'MAP': 'bg-pink-100 text-pink-800',
      'SCCP': 'bg-yellow-100 text-yellow-800'
    }
    return colors[protocol] || 'bg-gray-100 text-gray-600'
  }

  const renderSMSPreview = (packet) => {
    const smsText = packet.sms_text
    if (!smsText) return null
    
    return (
      <div className="mt-1 text-xs text-gray-600 truncate max-w-xs">
        📱 {smsText.length > 30 ? `${smsText.substring(0, 30)}...` : smsText}
      </div>
    )
  }

  const renderMSISDNInfo = (packet) => {
    const msisdns = []
    if (packet.source_msisdn) msisdns.push(`From: ${packet.source_msisdn}`)
    if (packet.destination_msisdn) msisdns.push(`To: ${packet.destination_msisdn}`)
    if (packet.sender_msisdn) msisdns.push(`Sender: ${packet.sender_msisdn}`)
    
    if (msisdns.length === 0) return null
    
    return (
      <div className="text-xs text-blue-600 mt-1">
        {msisdns.join(' | ')}
      </div>
    )
  }

  if (!packets || packets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No packets to display</div>
        <p className="text-gray-400">Upload a PCAP file to see packet analysis</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Protocol:</label>
            <select
              value={filterProtocol}
              onChange={(e) => {
                setFilterProtocol(e.target.value)
                setCurrentPage(1)
              }}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">All Protocols</option>
              {protocols.map(protocol => (
                <option key={protocol} value={protocol}>{protocol}</option>
              ))}
            </select>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {currentPackets.length} of {filteredAndSortedPackets.length} packets
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                onClick={() => handleSort('index')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                #
                {sortField === 'index' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                onClick={() => handleSort('timestamp')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Timestamp
                {sortField === 'timestamp' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                onClick={() => handleSort('protocol')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Protocol
                {sortField === 'protocol' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source → Destination
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telecom Info
              </th>
              <th 
                onClick={() => handleSort('length')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Length
                {sortField === 'length' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentPackets.map((packet, idx) => (
              <tr 
                key={`${packet.index}-${idx}`} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handlePacketClick(packet)}
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-900">
                  {packet.index || idx}
                </td>
                
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {formatTimestamp(packet.timestamp)}
                </td>
                
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getProtocolBadgeColor(packet.protocol)}`}>
                    {packet.protocol || 'Unknown'}
                  </span>
                  {packet.message_type_name && (
                    <div className="text-xs text-gray-500 mt-1">
                      {packet.message_type_name}
                    </div>
                  )}
                </td>
                
                <td className="px-4 py-3 text-sm text-gray-900">
                  <div className="space-y-1">
                    {packet.src_ip && packet.dst_ip && (
                      <div className="font-mono text-xs">
                        {packet.src_ip}:{packet.src_port || ''} → {packet.dst_ip}:{packet.dst_port || ''}
                      </div>
                    )}
                    {renderMSISDNInfo(packet)}
                  </div>
                </td>

                <td className="px-4 py-3 text-sm">
                  <div className="space-y-1">
                    {packet.service_center && (
                      <div className="text-xs text-purple-600">
                        SC: {packet.service_center}
                      </div>
                    )}
                    {packet.encoding_type && (
                      <div className="text-xs text-green-600">
                        Encoding: {packet.encoding_type}
                      </div>
                    )}
                    {packet.user_data_length && (
                      <div className="text-xs text-blue-600">
                        UDL: {packet.user_data_length}
                      </div>
                    )}
                    {renderSMSPreview(packet)}
                  </div>
                </td>

                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {packet.length || 0} bytes
                </td>

                <td className="px-4 py-3 text-sm text-blue-600 hover:text-blue-800">
                  View Details →
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Packet Detail Modal */}
      {showModal && selectedPacket && (
        <PacketDetailModal
          packet={selectedPacket}
          onClose={() => {
            setShowModal(false)
            setSelectedPacket(null)
          }}
        />
      )}
    </div>
  )
}

const PacketDetailModal = ({ packet, onClose }) => {
  const [activeTab, setActiveTab] = useState('general')

  const tabs = [
    { id: 'general', label: 'General', icon: '📋' },
    { id: 'sms', label: 'SMS Details', icon: '📱' },
    { id: 'smpp', label: 'SMPP', icon: '🔄' },
    { id: 'technical', label: 'Technical', icon: '⚙️' },
    { id: 'raw', label: 'Raw Data', icon: '🔍' }
  ]

  const formatValue = (value) => {
    if (value === null || value === undefined) return 'N/A'
    if (typeof value === 'object') return JSON.stringify(value, null, 2)
    return String(value)
  }

  const renderGeneralInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Index:</dt>
              <dd className="font-mono">{packet.index}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Timestamp:</dt>
              <dd>{new Date(packet.timestamp * 1000).toLocaleString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Protocol:</dt>
              <dd><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{packet.protocol}</span></dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Length:</dt>
              <dd>{packet.length} bytes</dd>
            </div>
          </dl>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Network Information</h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Source IP:</dt>
              <dd className="font-mono">{packet.src_ip || 'N/A'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Destination IP:</dt>
              <dd className="font-mono">{packet.dst_ip || 'N/A'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Source Port:</dt>
              <dd>{packet.src_port || 'N/A'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Destination Port:</dt>
              <dd>{packet.dst_port || 'N/A'}</dd>
            </div>
          </dl>
        </div>
      </div>

      {packet.layers && packet.layers.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Protocol Layers</h4>
          <div className="flex flex-wrap gap-2">
            {packet.layers.map((layer, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                {layer}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderSMSDetails = () => (
    <div className="space-y-4">
      {packet.sms_text && (
        <div>
          <h4 className="font-medium text-gray-900 mb-2">SMS Content</h4>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="text-sm text-green-800 font-medium mb-1">Message Text:</div>
            <div className="text-gray-900">{packet.sms_text}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">SMS Properties</h4>
          <dl className="space-y-2 text-sm">
            {packet.message_type_name && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Message Type:</dt>
                <dd className="font-medium">{packet.message_type_name}</dd>
              </div>
            )}
            {packet.encoding_type && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Encoding:</dt>
                <dd>{packet.encoding_type}</dd>
              </div>
            )}
            {packet.user_data_length !== undefined && (
              <div className="flex justify-between">
                <dt className="text-gray-600">User Data Length:</dt>
                <dd>{packet.user_data_length}</dd>
              </div>
            )}
            {packet.message_reference !== undefined && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Message Reference:</dt>
                <dd>{packet.message_reference}</dd>
              </div>
            )}
          </dl>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Phone Numbers</h4>
          <dl className="space-y-2 text-sm">
            {packet.source_msisdn && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Source MSISDN:</dt>
                <dd className="font-mono text-blue-600">{packet.source_msisdn}</dd>
              </div>
            )}
            {packet.destination_msisdn && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Destination MSISDN:</dt>
                <dd className="font-mono text-blue-600">{packet.destination_msisdn}</dd>
              </div>
            )}
            {packet.sender_msisdn && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Sender MSISDN:</dt>
                <dd className="font-mono text-blue-600">{packet.sender_msisdn}</dd>
              </div>
            )}
            {packet.service_center && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Service Center:</dt>
                <dd className="font-mono text-purple-600">{packet.service_center}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {packet.service_center_timestamp && (
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Timestamps</h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Service Center Timestamp:</dt>
              <dd>{packet.service_center_timestamp}</dd>
            </div>
            {packet.discharge_time && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Discharge Time:</dt>
                <dd>{packet.discharge_time}</dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  )

  const renderSMPPDetails = () => (
    <div className="space-y-4">
      {packet.smpp_command_name && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">SMPP Command</h4>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Command:</dt>
                <dd className="font-medium">{packet.smpp_command_name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Command ID:</dt>
                <dd className="font-mono">{packet.smpp_command_id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Status:</dt>
                <dd className={packet.smpp_command_status === 0 ? 'text-green-600' : 'text-red-600'}>
                  {packet.smpp_command_status}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Sequence:</dt>
                <dd>{packet.smpp_sequence}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">SMPP Addresses</h4>
            <dl className="space-y-2 text-sm">
              {packet.source_address && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">Source Address:</dt>
                  <dd className="font-mono text-blue-600">{packet.source_address}</dd>
                </div>
              )}
              {packet.destination_address && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">Destination Address:</dt>
                  <dd className="font-mono text-blue-600">{packet.destination_address}</dd>
                </div>
              )}
              {packet.service_type && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">Service Type:</dt>
                  <dd>{packet.service_type}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      )}

      {packet.short_message_hex && (
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Message Data</h4>
          <div className="bg-gray-50 border rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">Raw Message (Hex):</div>
            <div className="font-mono text-sm break-all text-gray-800">{packet.short_message_hex}</div>
          </div>
        </div>
      )}
    </div>
  )

  const renderTechnicalDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">PDU Details</h4>
          <dl className="space-y-2 text-sm">
            {packet.sms_pdu_type !== undefined && (
              <div className="flex justify-between">
                <dt className="text-gray-600">PDU Type:</dt>
                <dd className="font-mono">{packet.sms_pdu_type} (0x{packet.sms_pdu_type?.toString(16)})</dd>
              </div>
            )}
            {packet.data_coding_scheme !== undefined && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Data Coding:</dt>
                <dd>{packet.data_coding_scheme}</dd>
              </div>
            )}
            {packet.protocol_identifier !== undefined && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Protocol ID:</dt>
                <dd>{packet.protocol_identifier}</dd>
              </div>
            )}
            {packet.validity_period !== undefined && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Validity Period:</dt>
                <dd>{packet.validity_period}</dd>
              </div>
            )}
          </dl>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Address Details</h4>
          <dl className="space-y-2 text-sm">
            {packet.address_length !== undefined && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Address Length:</dt>
                <dd>{packet.address_length}</dd>
              </div>
            )}
            {packet.type_of_address !== undefined && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Type of Address:</dt>
                <dd className="font-mono">0x{packet.type_of_address?.toString(16)}</dd>
              </div>
            )}
            {packet.numbering_plan !== undefined && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Numbering Plan:</dt>
                <dd>{packet.numbering_plan}</dd>
              </div>
            )}
            {packet.type_of_number !== undefined && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Type of Number:</dt>
                <dd>{packet.type_of_number}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {(packet.tcp_flags_names || packet.tcp_flags) && (
        <div>
          <h4 className="font-medium text-gray-900 mb-2">TCP Flags</h4>
          <div className="flex flex-wrap gap-2">
            {packet.tcp_flags_names && packet.tcp_flags_names.map((flag, idx) => (
              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                {flag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderRawData = () => (
    <div className="space-y-4">
      {packet.payload_hex && (
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Payload (Hex)</h4>
          <div className="bg-gray-50 border rounded-lg p-3 max-h-64 overflow-y-auto">
            <div className="font-mono text-xs break-all text-gray-800">{packet.payload_hex}</div>
          </div>
        </div>
      )}

      {packet.user_data_hex && (
        <div>
          <h4 className="font-medium text-gray-900 mb-2">User Data (Hex)</h4>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="font-mono text-xs break-all text-blue-800">{packet.user_data_hex}</div>
          </div>
        </div>
      )}

      <div>
        <h4 className="font-medium text-gray-900 mb-2">Raw Packet Data (JSON)</h4>
        <div className="bg-gray-50 border rounded-lg p-3 max-h-96 overflow-y-auto">
          <pre className="text-xs text-gray-800 whitespace-pre-wrap">
            {JSON.stringify(packet, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Packet Details #{packet.index}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8 px-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'general' && renderGeneralInfo()}
          {activeTab === 'sms' && renderSMSDetails()}
          {activeTab === 'smpp' && renderSMPPDetails()}
          {activeTab === 'technical' && renderTechnicalDetails()}
          {activeTab === 'raw' && renderRawData()}
        </div>
      </div>
    </div>
  )
}

export default PacketTable