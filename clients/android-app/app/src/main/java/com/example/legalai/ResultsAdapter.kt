package com.example.legalai

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class ResultsAdapter(private var items: List<SearchResult> = emptyList()) : RecyclerView.Adapter<ResultsAdapter.VH>() {
  class VH(v: View): RecyclerView.ViewHolder(v) {
    val title: TextView = v.findViewById(R.id.title)
    val snippet: TextView = v.findViewById(R.id.snippet)
  }
  override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) =
    VH(LayoutInflater.from(parent.context).inflate(R.layout.item_result, parent, false))
  override fun onBindViewHolder(holder: VH, position: Int) {
    val it = items[position]
    holder.title.text = it.title ?: it.id
    holder.snippet.text = it.text?.take(400) ?: ""
  }
  override fun getItemCount() = items.size
  fun submit(list: List<SearchResult>) { items = list; notifyDataSetChanged() }
}
