# Vaccines from the runners, 2026-09-07

Each is a rule plus the measurement that catches its disease returning. A rule with no check is a note, not a vaccine. All five were paid for on 2026-09-07, most of them by the runners doing the wrong thing first.

## V · Measure both sides identically

**Disease.** A test compares a state before an action with a state after it, using a different method for each, and reports a change that never happened.

**Instance.** A study read a control's label before a tap with a tolerant matcher and after it with a strict one. The strict matcher found nothing, and the comparison treated a string differing from null as a change. Six shapes were reported working while four were broken.

**Check.** The before-reading and the after-reading must call the same function. A study whose two readings are not literally the same code path fails review.

## V · A pass must assert complete coverage

**Disease.** A run reports success while a requested behaviour does not exist, because the missing thing was never scored.

**Check.** Every scored case passing with one requested behaviour absent is INCOMPLETE, not PASS. The receipt names the gap.

## V · A verdict must not outlive its inputs

**Disease.** A receipt is treated as applicable to new bytes because some input still matches.

**Check.** A receipt applies only when **every** input it consumed is present at the same content hash. Compare hashes, not identifiers: a name can be reused, a hash cannot.

## V · A silent blank is a failure

**Disease.** A path produces an empty field, an empty image or an empty answer and presents it as success.

**Instances, all on one day.** An export wrote a blank credit line rather than refusing. A checker skipped an uncompressed stream and reported an artefact as empty on every field. A control was reported firing because a null compared unequal.

**Check.** Any required field that resolves empty fails loudly at the point of production. Refusal with a stated reason is a result; silence is not.

## V · Repetition is not evidence

**Disease.** Confidence grows with the number of identical runs, and compute is spent proving the same fact.

**Instance.** 615 passes across five hours, same bytes, same environment, network cut. Every one confirmed determinism, which the first dozen had established. The fans ran for five hours and the information stopped arriving after the first.

**Check.** A repeat rate is labelled for what it measures. Determinism is not robustness, and a rate stays a rate until variance is injected.

## What was actually efficient, and what was not

**Read this before commissioning anything.** These are the measured yields from 2026-09-07, a day that cost **$357.69** in model usage, most of it on runners and scheduled checks.

| method | what it cost | what it found |
| --- | --- | --- |
| **The owner using the product on a real phone** | about two hours of tapping | **20 defects**, including a control that half works, an interconnector presented as domestic, offshore engines silent, a placeholder title, a black screen in landscape, and a missing size filter |
| **Reading the code and the data with targeted searches** | minutes, negligible tokens | Eight of ten interconnectors hold no far converter; the counterparty country is already held for every link; the voltage layers are genuinely OpenStreetMap; the size slider still exists in another repository |
| **Adversarial review of the stated logic** | two briefs, one page each | An unsafe applicability rule, a cycle guard that collides on our own identifiers, a quarantine that could never reopen, a pass that hid a gap, and a power flow that can converge to artefacts |
| **A study written to answer one question** | ninety seconds of browser time | Located the layers fault exactly: the label flips, the panel does not move, identical on both compositions, and it fails entirely on the smallest landscape screen |
| **Automated repeat runs** | **30.4 million tokens across 19 scheduled checks**, plus five hours of the machine at 60 to 92% CPU | **615 identical passes. Zero product defects.** It established determinism in the first hour and then confirmed it 600 more times |

**The lesson, stated plainly.** The most expensive instrument found the least. A person with the actual product on the actual device found more in two hours than five hours of continuous automation and a fleet of scheduled checks. The automation was not useless: it proved the harness was stable and it located a fault precisely once someone told it where to look. But it cannot notice that a button feels dead, that a card is in the way, or that a link claims to be international while never leaving the country.

**So the order of work is:**

1. **Use the product.** On the real device, in both orientations. Report what feels wrong, even vaguely.
2. **Read the code and the data** to check the claim before building anything. Half of tonight's tickets changed shape once someone looked, and two turned out to be the opposite of the report.
3. **Write one study that answers one question**, then close the session.
4. **Automate only what must be re-checked**, and only after it has failed once. A test that has never failed is a test that has not yet earned its schedule.

**What to avoid, with the receipts.** Scheduled checks every fifteen minutes consumed 30.4 million tokens for nineteen answers that mostly said nothing changed. Long sessions are expensive: 96% of the day's usage sat above 150k of context. Repeat runs of identical bytes stop informing after the first few. And an idle floor is not a target: a runner that stops at its own floor slept thirteen minutes in every fifteen while reporting that it was working.

## Setting the runners up on Windows PowerShell

Everything below was used tonight from a cold start. This is Windows PowerShell 5.1, so no pipeline chain operators, no ternaries, and `wmic` is gone.

**Where things live.** Runners on the SSD at `D:\gridatlas-ci`. The browser driver is already installed at `C:\Users\vikra\LocalCI\PipelineNews-GridAtlas\v004\node_modules\playwright` at version 1.58.2. The real-device bridge is `D:\android\platform-tools\adb.exe`. Nothing is installed globally and no service is registered.

**Run one study. One session, opened and closed:**

```powershell
node D:\gridatlas-ci\overnight.mjs GG-027
```

**Measure what a session costs before commissioning more:**

```powershell
node D:\gridatlas-ci\smoke.mjs
node D:\gridatlas-ci\smoke.mjs --quiet --one
```

**Start a windowed runner detached, so it outlives the session that started it:**

```powershell
$env:CI_WINDOW_MIN = '360'
$p = Start-Process -FilePath 'C:\Program Files\nodejs\node.exe' `
  -ArgumentList 'D:\gridatlas-ci\pair-runner.mjs' `
  -WorkingDirectory 'D:\gridatlas-ci' -WindowStyle Hidden `
  -RedirectStandardOutput 'D:\gridatlas-ci\pair-runner.stdout.log' `
  -RedirectStandardError  'D:\gridatlas-ci\pair-runner.stderr.log' -PassThru
'runner pid ' + $p.Id
```

**Check what is alive, matched by command line rather than by process name:**

```powershell
Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
  Where-Object { $_.CommandLine -match 'pair-runner|overnight|worker' } |
  ForEach-Object { $_.ProcessId.ToString() + '  ' + $_.CommandLine }
```

**Stop everything and give the memory back:**

```powershell
Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
  Where-Object { $_.CommandLine -match 'pair-runner|overnight|worker' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -Confirm:$false }
Get-Process chrome -ErrorAction SilentlyContinue | Stop-Process -Force -Confirm:$false
```

**Watch the machine while it works.** This firmware exposes no temperature sensor, so the clock against its rated maximum is the throttle signal:

```powershell
(Get-Counter '\Processor(_Total)\% Processor Time' -SampleInterval 2 -MaxSamples 3).CounterSamples |
  ForEach-Object { '{0:N0}%' -f $_.CookedValue }
Get-CimInstance Win32_Processor | Select-Object -First 1 |
  ForEach-Object { 'clock ' + $_.CurrentClockSpeed + ' of ' + $_.MaxClockSpeed + ' MHz' }
'free RAM {0:N1} GB' -f ((Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory / 1MB)
```

**Drive a real handset instead of a device profile.** Enable developer options and USB debugging on the phone, plug it in, accept the prompt on the phone, then:

```powershell
D:\android\platform-tools\adb.exe devices
```

A listed device can be driven directly by the browser driver. The phone renders, so the laptop stays cool. No emulator and no Android Studio: the whole bridge was a 7.7 MB download and 19 MB on disk.

**Pitfalls that cost real time, recorded so they are not rediscovered.** A Bash heredoc halves backslashes, so write a script to a file rather than piping it. An apostrophe inside a single-quoted shell string ends the string. A Windows checkout rewrites line endings, so hash git blobs rather than working copies. And a backtick is the line continuation character here, not a backslash.

---

**Confirm this repository's runner is alive before adding to it.** It has previously reported findings from a dead runner, which is the same disease as the silent blank, wearing a different coat.
