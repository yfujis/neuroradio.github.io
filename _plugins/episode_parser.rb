require "cgi"

module NeuroRadio
  module EpisodeParser
    SECTION_NAMES = {
      "episode" => "episode_number",
      "episode number" => "episode_number",
      "number" => "episode_number",
      "title" => "title",
      "date" => "date",
      "spotify" => "spotify",
      "spotify embed" => "spotify",
      "spotify url" => "spotify",
      "performers" => "performers",
      "performer" => "performers",
      "cast" => "performers",
      "出演者" => "performers",
      "topics" => "topics",
      "topic" => "topics",
      "トピック" => "topics",
      "summary" => "summary_text",
      "概要" => "summary_text",
      "show notes" => "show_notes_text",
      "shownotes" => "show_notes_text",
      "show note" => "show_notes_text",
      "editorial notes" => "editorial_notes_text",
      "editorial note" => "editorial_notes_text",
      "編集後記" => "editorial_notes_text"
    }

    module_function

    def parse(content)
      sections = {}
      current = nil

      content.to_s.each_line do |raw_line|
        line = raw_line.strip
        if line.empty?
          sections[current] << "" if %w[summary_text show_notes_text editorial_notes_text].include?(current)
          next
        end

        inline = line.match(/^([^:：]+)[:：]\s*(.*)$/)
        name = inline ? section_name("#{inline[1]}:") : section_name(line)

        if name
          current = name
          sections[current] ||= []
          sections[current] << inline[2].strip if inline && inline[2] && !inline[2].strip.empty?
          next
        end

        sections[current] << line if current
      end

      sections
    end

    def section_name(line)
      normalized = line.to_s.strip.downcase.sub(/[:：]\s*$/, "")
      SECTION_NAMES[normalized]
    end

    def first(sections, key)
      Array(sections[key]).find { |line| !line.to_s.strip.empty? }.to_s.strip
    end

    def block(sections, key)
      Array(sections[key]).join("\n").strip
    end

    def split_list(value)
      value.to_s.split(/[,、\n]/).map(&:strip).reject(&:empty?)
    end

    def clean_note_line(line)
      line.to_s.strip.sub(/^[-*・]\s*/, "")
    end

    def inline_markdown_to_html(value)
      escaped = CGI.escapeHTML(value.to_s)
      escaped.gsub(/(!?)\[([^\]]*)\]\(([^)]+)\)/) do
        bang = Regexp.last_match(1)
        label = CGI.escapeHTML(Regexp.last_match(2))
        href = CGI.escapeHTML(Regexp.last_match(3))
        if bang == "!"
          %(<figure><img src="#{href}" alt="#{label}"></figure>)
        else
          %(<a href="#{href}">#{label}</a>)
        end
      end
    end

    def notes_to_html(value)
      lines = value.to_s.lines.map { |line| clean_note_line(line) }
      blocks = []
      items = []

      flush = lambda do
        unless items.empty?
          blocks << "<ul>\n#{items.map { |item| "<li>#{inline_markdown_to_html(item)}</li>" }.join("\n")}\n</ul>"
          items = []
        end
      end

      lines.each do |line|
        if line.empty?
          flush.call
          next
        end

        image = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
        if image
          flush.call
          blocks << %(<figure><img src="#{CGI.escapeHTML(image[2])}" alt="#{CGI.escapeHTML(image[1])}"></figure>)
        else
          items << line
        end
      end

      flush.call
      blocks.empty? ? "<ul><li>準備中です。</li></ul>" : blocks.join("\n\n")
    end
  end
end

Jekyll::Hooks.register :posts, :pre_render do |post|
  sections = NeuroRadio::EpisodeParser.parse(post.content)

  post.data["episode_number"] ||= NeuroRadio::EpisodeParser.first(sections, "episode_number").sub(/^#/, "")
  post.data["title"] ||= NeuroRadio::EpisodeParser.first(sections, "title")
  post.data["spotify"] ||= NeuroRadio::EpisodeParser.first(sections, "spotify")
  post.data["performers"] ||= NeuroRadio::EpisodeParser.split_list(NeuroRadio::EpisodeParser.first(sections, "performers"))
  post.data["topics"] ||= NeuroRadio::EpisodeParser.split_list(NeuroRadio::EpisodeParser.first(sections, "topics"))
  post.data["summary"] ||= NeuroRadio::EpisodeParser.block(sections, "summary_text")
  post.data["show_notes_html"] = NeuroRadio::EpisodeParser.notes_to_html(NeuroRadio::EpisodeParser.block(sections, "show_notes_text"))
  post.data["editorial_notes_html"] = NeuroRadio::EpisodeParser.notes_to_html(NeuroRadio::EpisodeParser.block(sections, "editorial_notes_text"))
end
