package com.example.legalai

import android.os.Bundle
import android.view.inputmethod.EditorInfo
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.legalai.databinding.ActivityMainBinding
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {
  private lateinit var binding: ActivityMainBinding
  private val adapter = ResultsAdapter()

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    binding = ActivityMainBinding.inflate(layoutInflater)
    setContentView(binding.root)
    setSupportActionBar(binding.toolbar)

    binding.resultsRecycler.layoutManager = LinearLayoutManager(this)
    binding.resultsRecycler.adapter = adapter

    binding.searchBtn.setOnClickListener { doSearch() }
    binding.queryInput.setOnEditorActionListener { _, actionId, _ ->
      if (actionId == EditorInfo.IME_ACTION_SEARCH) { doSearch(); true } else false
    }
  }

  private fun doSearch() {
    val q = binding.queryInput.text?.toString()?.trim()
    if (q.isNullOrEmpty()) { Toast.makeText(this,"Zadajte dopyt",Toast.LENGTH_SHORT).show(); return }
    binding.progress.visibility = android.view.View.VISIBLE
    binding.searchBtn.isEnabled = false

    lifecycleScope.launch {
      try {
        val res = RetrofitClient.api.search(SearchRequest(q, limit = 10))
        adapter.submit(res.results)
      } catch (e: Exception) {
        Toast.makeText(this@MainActivity,"Error: ${e.message}",Toast.LENGTH_LONG).show()
      } finally {
        binding.progress.visibility = android.view.View.GONE
        binding.searchBtn.isEnabled = true
      }
    }
  }
}
