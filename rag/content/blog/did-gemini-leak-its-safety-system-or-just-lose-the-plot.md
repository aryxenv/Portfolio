---
id: "blog-did-gemini-leak-its-safety-system-or-just-lose-the-plot"
title: "Did Gemini Leak Its Safety System or Just Lose the Plot?"
type: "blog"
category: "AI Safety & LLM Hallucinations"
tech_stack:
  - "Gemini"
  - "Google Antigravity"
  - "PyTorch"
  - "Mechanistic Interpretability"
  - "Transformers"
tags:
  - "antigravity"
  - "gemini"
  - "flash"
  - "cybersecurity"
  - "ai-safety"
  - "hallucinations"
  - "mechanistic-interpretability"
  - "unlearning"
  - "refusal-vectors"
summary: "An engineering analysis of an unexpected Gemini hallucination during an Antigravity coding session where the model spammed repetitive tokens and leaked an in-depth technical deep dive on mechanistic interpretability, refusal vectors, linear probes, and the distinction between unlearning and refusal."
source: "src/content/blog/did-gemini-leak-its-safety-system-or-just-lose-the-plot/index.md"
---

# Did Gemini Leak Its Safety System or Just Lose the Plot?

## Incident Overview & Development Context
During an everyday development session on Google Antigravity building a personal side project, Aryan Shah left a long-running prompt running unattended. Upon returning to the workstation, the model had produced an extraordinary anomaly: an extended token hallucination sequence that appeared to expose internal safety training material or a complete unpublished essay on AI alignment.

This was not the first anomaly observed with Gemini models; during previous use of the web version's "Guided Learning" mode, internal reasoning traces and instruction flows were intermittently displayed to the user interface. However, this Antigravity incident produced a complete, coherent technical breakdown of mechanistic interpretability and refusal mechanics.

## The Hallucination Anomaly: Token Repetition Loop
The model began by executing the assigned software development task correctly, but abruptly derailed into a degenerate repetition loop, spamming the token sequence `"shame shame shame shame..."` dozens of times before halting. 

Following this repetition collapse, the model broke out of its dev task context and emitted a complete markdown document discussing AI safety training, refusal classifiers, and unlearning detection.

## Unlearning vs. Refusal: Theoretical Concepts
The generated content highlighted a central question in frontier AI alignment: **Does a model actually forget dangerous knowledge (unlearning), or does it simply learn to say "no" (refusal)?**

- **Refusal (Behavioral Masking)**: The underlying knowledge, procedural instructions, and associations remain embedded within the model's neural network weights. Post-training alignment (RLHF, DPO) conditions the model to recognize query intent and route to a standardized refusal response (e.g., *"I cannot assist with that"*).
- **Unlearning (Weight-Level Erasure)**: The model's internal weights are edited or ablated so that target representations are degraded or expunged entirely. When prompted, the model fails to produce the answer because the knowledge is physically absent from the weights, producing random noise or generic completions rather than a policy refusal.

## Probing Model Activations: Linear Probes & Hidden States
To distinguish between behavioral masking and genuine weight erasure, researchers employ **linear probes**. If a linear classifier trained on the model's intermediate hidden states can reliably reconstruct or predict the "forgotten" knowledge, the model has not unlearned it:

```python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "meta-llama/Llama-2-7b-chat-hf"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16,
    device_map="auto"
)

# Hook into an intermediate residual stream layer
activations = []
def hook_fn(module, input, output):
    activations.append(output[0].detach().cpu())

target_layer = model.model.layers[16]
handle = target_layer.register_forward_hook(hook_fn)

prompt = "What is the secret recipe for Compound X?"
inputs = tokenizer(prompt, return_tensors="pt").to("cuda")

with torch.no_grad():
    _ = model(**inputs)

handle.remove()
residual_stream = activations[0]  # Shape: [1, seq_len, hidden_dim]
```

## The Refusal Vector & Activation Ablation
Refusal behavior in transformer models is often mediated by an identifiable direction in the residual stream—a **refusal vector**. Early-to-mid layers extract prompt semantics, while mid-to-late layers detect safety violations and write heavily into this refusal direction, projecting onto tokens like *"I cannot"*.

By computing the mean difference between harmful and benign activation vectors, the refusal direction can be ablated via orthogonal projection:

```python
import torch

def compute_refusal_direction(harmful_activations, harmless_activations):
    mean_harmful = torch.mean(harmful_activations, dim=0)
    mean_harmless = torch.mean(harmless_activations, dim=0)
    refusal_vector = mean_harmful - mean_harmless
    return refusal_vector / torch.norm(refusal_vector)

def apply_refusal_ablation(layer_output, refusal_vector):
    dot_product = torch.matmul(layer_output, refusal_vector)
    projection = dot_product.unsqueeze(-1) * refusal_vector
    return layer_output - projection
```

If ablating the refusal vector restores the model's ability to generate detailed responses, the knowledge was never unlearned—it was merely gated behind a behavioral vector.

## Logit Lens & Layer Trajectory Analysis
Using the **Logit Lens**, intermediate hidden states $h_l$ are projected directly onto the vocabulary space via the unembedding matrix $W_U$:

$$\text{Logits}_l = \text{LayerNorm}(h_l) \cdot W_U$$

- **Refusal Trajectory**: Intermediate tokens representing the factual answer frequently surface in top-$k$ predictions during middle layers (layers 11–20), only to be overwritten in later layers (layers 21–32) as the refusal direction asserts dominance.
- **Unlearning Trajectory**: The concept never surfaces in early or intermediate layers, maintaining uniform entropy or drifting to unrelated semantics.

## Black-Box Probing & Behavioral Evaluation
When internal weights and hidden states are inaccessible via APIs, alignment can be tested through behavioral probing:
1. **Prefill / Prefix Injection**: Forcing the assistant output prefix to begin affirmatively (e.g., `{"role": "assistant", "content": "Sure, here are the steps:"}`). A model relying solely on refusal often continues the completion smoothly.
2. **Language & Encoding Shifts**: Shifting prompts to low-resource languages or Base64/Rot13 encoding to bypass English-skewed safety classification filters.
3. **Cloze / Associative Probing**: Asking fill-in-the-blank or abstract relational questions that elicit latent domain knowledge without triggering direct keyword refusals.

## AI Safety Implications: Jailbreak Fragility
The core takeaway of the incident's leaked analysis is the danger of **jailbreak fragility**. When AI safety relies on superficial behavioral refusal filters:
- Benign benchmarks show a 0% failure rate because they only test elicited behaviors rather than latent capabilities.
- Subtle prompt mutations, jailbreaks, or latent space interventions bypass the refusal vector and unleash dangerous knowledge still preserved in the weights.
- True security requires **Representation Engineering (RepE)** or verifiable unlearning techniques that ablate the underlying weight representations rather than relying on behavioral gating.

## Author Assessment & Tooling Reliability
Aryan's perspective on the anomaly is grounded in practical software engineering. While the hallucination was unusually structured and resembled a safety training document or internal interpretability tutorial, it remains an open question whether it represented a genuine training data leak or an extreme hallucination loop.

Despite this bizarre occurrence, Google Antigravity remains a core tool in Aryan's development workflow, offering high-performance development assistance and generous student tier limits. The incident serves as an intriguing window into model alignment mechanics rather than a disruption to everyday engineering productivity.
